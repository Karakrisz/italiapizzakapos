<script lang="ts" setup>
interface WAPFChoice {
  slug: string;
  label: string;
  selected: boolean;
  pricing_type: string;
  pricing_amount: number;
}

interface WAPFField {
  id: string;
  label: string;
  description: string | null;
  type: string;
  required: boolean;
  class: string | null;
  width: string | null;
  options: {
    choices: WAPFChoice[];
  };
  conditionals: any[];
  pricing: {
    type: string;
    amount: number;
    enabled: boolean;
  };
}

interface WAPFConfig {
  id: string;
  type: string;
  layout: {
    labels_position: string;
    instructions_position: string;
    mark_required: boolean;
  };
  fields: WAPFField[];
  rule_groups: any[];
}

interface SelectedValue {
  checked: boolean;
  quantity: number;
}

const props = defineProps<{
  metadata: string;
}>();

const emit = defineEmits(['field-change', 'price-change']);

const wapfConfig = computed<WAPFConfig>(() => {
  try {
    return JSON.parse(props.metadata);
  } catch (e) {
    console.error('Failed to parse WAPF metadata:', e);
    return {} as WAPFConfig;
  }
});

const selectedValues = ref<Record<string, any>>({});

const formatFieldData = () => {
  const formattedData = {};
  
  wapfConfig.value.fields?.forEach(field => {
    if (field.type === 'checkboxes') {
      // Csak egy egyszerű tömböt küldünk a WooCommerce-nek a kiválasztott slugokkal
      const selectedSlugs = Object.entries(selectedValues.value[field.id] || {})
        .filter(([_, value]) => value.checked)
        .map(([slug]) => slug);
      
      formattedData[field.id] = selectedSlugs;

      // A mennyiségeket külön mezőben küldjük
      if (selectedSlugs.length > 0) {
        const quantities = {};
        selectedSlugs.forEach(slug => {
          const qty = selectedValues.value[field.id][slug].quantity;
          if (qty > 1) {
            quantities[slug] = qty;
          }
        });

        if (Object.keys(quantities).length > 0) {
          formattedData[`${field.id}_quantities`] = quantities;
        }
      }
    } else if (field.type === 'radio') {
      formattedData[field.id] = selectedValues.value[field.id] || '';
    }
  });
  
  return formattedData;
};

onMounted(() => {
  if (wapfConfig.value.fields) {
    wapfConfig.value.fields.forEach(field => {
      if (field.type === 'checkboxes') {
        selectedValues.value[field.id] = {};
        field.options.choices.forEach(choice => {
          selectedValues.value[field.id][choice.slug] = {
            checked: false,
            quantity: 1
          };
        });
      } else if (field.type === 'radio') {
        // A kiválasztott vagy alapértelmezett érték beállítása
        const defaultChoice = field.options.choices.find(choice => choice.selected);
        selectedValues.value[field.id] = defaultChoice ? defaultChoice.slug : field.options.choices[0]?.slug;
      }
    });
    calculateTotalPrice();
  }
});

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateTotalPrice = () => {
  let totalAdditionalPrice = 0;

  wapfConfig.value.fields?.forEach(field => {
    if (field.type === 'checkboxes') {
      field.options.choices.forEach(choice => {
        const value = selectedValues.value[field.id]?.[choice.slug];
        if (value?.checked && choice.pricing_type === 'fixed') {
          totalAdditionalPrice += choice.pricing_amount * (value.quantity || 1);
        }
      });
    } else if (field.type === 'radio') {
      const selectedSlug = selectedValues.value[field.id];
      const selectedChoice = field.options.choices.find(choice => choice.slug === selectedSlug);
      if (selectedChoice?.pricing_type === 'fixed') {
        totalAdditionalPrice += selectedChoice.pricing_amount;
      }
    }
  });

  emit('price-change', totalAdditionalPrice);
  return totalAdditionalPrice;
};

const handleCheckboxChange = (fieldId: string, choiceSlug: string, checked: boolean) => {
  if (!selectedValues.value[fieldId]) {
    selectedValues.value[fieldId] = {};
  }
  
  selectedValues.value[fieldId][choiceSlug] = {
    checked,
    quantity: checked ? (selectedValues.value[fieldId][choiceSlug]?.quantity || 1) : 0
  };
  
  emit('field-change', formatFieldData());
  calculateTotalPrice();
};

const handleQuantityChange = (fieldId: string, choiceSlug: string, quantity: number) => {
  if (quantity < 1) quantity = 1;
  
  selectedValues.value[fieldId][choiceSlug].quantity = quantity;
  emit('field-change', formatFieldData());
  calculateTotalPrice();
};

const getFieldClass = (field: WAPFField) => {
  const classes = ['wapf-field'];
  if (field.required) classes.push('required');
  if (field.class) classes.push(field.class);
  if (wapfConfig.value.layout.labels_position) {
    classes.push(`labels-${wapfConfig.value.layout.labels_position}`);
  }
  return classes.join(' ');
};
</script>

<template>
  <div v-if="wapfConfig.fields" class="wapf-fields-container mt-4 space-y-6">
    <div
      v-for="field in wapfConfig.fields"
      :key="field.id"
      :class="getFieldClass(field)"
    >
      <label :class="{ required: field.required }" class="block mb-2 font-medium text-gray-900">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>
      
      <div v-if="field.description" class="text-sm text-gray-600 mb-2">
        {{ field.description }}
      </div>

      <!-- Checkbox group with quantity -->
      <div v-if="field.type === 'checkboxes'" class="space-y-2">
        <div
          v-for="choice in field.options.choices"
          :key="choice.slug"
          class="flex items-center gap-4"
        >
          <div class="flex items-center">
            <input
              :id="`${field.id}-${choice.slug}`"
              type="checkbox"
              :checked="selectedValues[field.id]?.[choice.slug]?.checked"
              class="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
              @change="(e) => handleCheckboxChange(field.id, choice.slug, e.target.checked)"
            >
            <label
              :for="`${field.id}-${choice.slug}`"
              class="ml-2 text-sm font-medium text-gray-900 flex items-center gap-2"
            >
              {{ choice.label }}
              <span
                v-if="choice.pricing_type !== 'none' && choice.pricing_amount > 0"
                class="text-sm font-normal text-gray-500"
              >
                (+ {{ formatPrice(choice.pricing_amount) }})
              </span>
            </label>
          </div>

          <!-- Quantity input -->
          <div
            v-if="selectedValues[field.id]?.[choice.slug]?.checked"
            class="flex items-center gap-2"
          >
            <label
              :for="`${field.id}-${choice.slug}-quantity`"
              class="text-sm text-gray-600"
            >
              Mennyiség:
            </label>
            <input
              :id="`${field.id}-${choice.slug}-quantity`"
              type="number"
              min="1"
              class="w-16 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              :value="selectedValues[field.id]?.[choice.slug]?.quantity"
              @input="(e) => handleQuantityChange(field.id, choice.slug, parseInt((e.target as HTMLInputElement).value) || 1)"
            >
          </div>
        </div>
      </div>

      <!-- Radio group -->
      <div v-if="field.type === 'radio'" class="space-y-2">
        <div
          v-for="choice in field.options.choices"
          :key="choice.slug"
          class="flex items-center"
        >
          <input
            :id="`${field.id}-${choice.slug}`"
            v-model="selectedValues[field.id]"
            type="radio"
            :name="field.id"
            :value="choice.slug"
            :checked="choice.selected"
            class="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
            @change="(e) => {
              if (typeof selectedValues.value !== 'object') {
                selectedValues.value = {};
              }
              selectedValues.value[field.id] = e.target.value;
              emit('field-change', formatFieldData());
              calculateTotalPrice();
            }"
          >
          <label
            :for="`${field.id}-${choice.slug}`"
            class="ml-2 text-sm font-medium text-gray-900 flex items-center gap-2"
          >
            {{ choice.label }}
            <span
              v-if="choice.pricing_type !== 'none' && choice.pricing_amount > 0"
              class="text-sm font-normal text-gray-500"
            >
              (+ {{ formatPrice(choice.pricing_amount) }})
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wapf-fields-container {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.wapf-field.required label::after {
  content: "*";
  color: #ef4444;
  margin-left: 0.25rem;
}

.wapf-field + .wapf-field {
  margin-top: 1.5rem;
}

input[type="radio"] {
  border-radius: 100%;
}

input[type="radio"]:checked {
  background-color: currentColor;
  border-color: currentColor;
}

input[type="checkbox"] {
  border-radius: 0.25rem;
}

input[type="checkbox"]:checked {
  background-color: currentColor;
  border-color: currentColor;
}
</style>