<script setup>
defineProps({
    type: {
        type: String,
        default: '',
    },
    hint: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: '',
    }
})
const emit = defineEmits(['update: modelValue'])
</script>

<template>
    <input 
        :class="`${type}`" 
        :placeholder="`${hint}`"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
    >
</template>

<style scoped>
.inputText {
    width: 100%;
    padding: 10px;
    font-size: 1.1em;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s ease;
}

.inputTextChange {
    width: 60%;
    padding: 10px;
    font-size: 0.95em;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s ease;
}
</style>