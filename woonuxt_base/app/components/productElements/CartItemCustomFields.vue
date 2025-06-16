<script setup>
const { item } = defineProps({
  item: { type: Object, required: true },
});

const formatPrice = (amount) => {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const customFields = computed(() => {
  if (!item?.extraData) return null;

  const formattedFields = [];

  // Find and parse WAPF field groups
  const wapfData = item.extraData.find(data => data.key === 'wapf_field_groups');
  if (wapfData) {
    try {
      const parsedWapf = JSON.parse(wapfData.value);

      parsedWapf.forEach(group => {
        if (group.fields && group.field_data) {
          Object.entries(group.fields).forEach(([fieldId, value]) => {
            const fieldInfo = group.field_data[fieldId];
            if (!fieldInfo) return;

            if (Array.isArray(value)) {
              // Ez egy checkbox csoport
              if (value.length > 0) {
                const formattedValue = value.map(slug => {
                  const choice = fieldInfo.choices[slug];
                  const quantities = group.fields[`${fieldId}_quantities`] || {};
                  const quantity = quantities[slug];
                  return choice 
                    ? `${choice.label}${quantity ? ` (${quantity}x)` : ''}`
                    : slug;
                }).join(', ');

                formattedFields.push({
                  label: fieldInfo.label,
                  value: formattedValue,
                  type: 'wapf'
                });
              }
            } else if (typeof value === 'string') {
              // Ez egy radio button
              const choice = fieldInfo.choices[value];
              if (choice) {
                formattedFields.push({
                  label: fieldInfo.label,
                  value: choice.label,
                  type: 'wapf'
                });
              }
            }
          });
        }
      });
    } catch (e) {
      console.error('Failed to parse WAPF data:', e);
    }
  }

  // Add additional price if exists
  const additionalPrice = item.extraData.find(data => data.key === 'additional_price')?.value;
  if (additionalPrice && parseInt(additionalPrice) > 0) {
    formattedFields.push({
      label: 'Extra opciók ára',
      value: formatPrice(parseInt(additionalPrice)),
      type: 'price'
    });
  }

  // Add total custom price if exists
  const totalPrice = item.extraData.find(data => data.key === 'total_custom_price')?.value;
  if (totalPrice) {
    formattedFields.push({
      label: 'Végösszeg',
      value: formatPrice(parseInt(totalPrice)),
      type: 'total'
    });
  }

  return formattedFields;
});
</script>

<template>
  <div
    v-if="customFields?.length"
    class="text-sm text-stone-500 space-y-2 -mt-4 mb-4"
  >
    <div
      v-for="field in customFields"
      :key="`${field.label}-${field.value}`"
      class="grid grid-cols-[auto_1fr] gap-x-2"
      :class="{
        'font-medium': field.type === 'price',
        'text-primary-600': field.type === 'total'
      }"
    >
      <div class="flex gap-2">
        <span>-</span>
        <span class="font-medium whitespace-nowrap">{{ field.label }}:</span>
      </div>
      <span class="break-words">{{ field.value }}</span>
    </div>
  </div>
</template>