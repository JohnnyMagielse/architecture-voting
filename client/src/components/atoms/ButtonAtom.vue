<template>
    <button
        :class="`border flex py-2 px-6 text-white border-white rounded-lg 
        ${backgroundColor} hover:bg-sky-700 gap-2`"
        @click="onClick"
        :disabled="disabled"
    >
        <div class="text">
            {{ text }}
        </div>
    </button>
</template>

<script>
export default {
    props: {
        text: String,
        onClick: {
            type: Function,
            default: () => {},
        },
        type: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        backgroundColor: {
            type: String,
            default: 'bg-blue-400',
        },
    },
};
</script>