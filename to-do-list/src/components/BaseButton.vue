<script setup>
defineProps({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'normal',
        validator: (value) => [
            'normal', 'remove', 'add', 
            'update', 'sort', 'smallNormal',
            'smallRemove', 'smallAdd', 'smallUpdate',
            'smallSort', 'smallSave'].includes(value)
    }
})
const emit = defineEmits(['click'])
const handleClick = () => {
    emit('click')
}
</script>

<template>
    <button :class="`${type}Btn`"
            @click="handleClick">{{ text }}</button>
</template>

<style scoped>
/* 按鈕統一基礎樣式 */
button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    border-radius: 20px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    border: 2px solid #000;
}

/* 基本按鈕大小 */
.normalBtn,
.sortBtn,
.removeBtn,
.updateBtn,
.addBtn {
    width: 150px;
    height: 45px;
    font-size: 1em;
}

/* small 按鈕系列 */
.smallRemoveBtn,
.smallUpdateBtn,
.smallAddBtn,
.smallNormalBtn,
.smallSortBtn,
.smallSortBtn,
.smallSaveBtn {
    width: 95px;
    height: 35px;
    font-size: 0.85em;
}

/* 返回按鈕 - 綠色 */
.normalBtn,
.smallNormalBtn {
    background-color: #4CAF50;
    color: white;
}

.normalBtn:hover,
.smallNormalBtn:hover {
    background-color: #45A049;
}

/* 刪除按鈕 - 紅色 */
.removeBtn,
.smallRemoveBtn {
    background-color: #F44336;
    color: white;
}

.removeBtn:hover,
.smallRemoveBtn:hover {
    background-color: #E53935;
}

/* 新增按鈕 - 橙色 */
.addBtn,
.smallAddBtn {
    background-color: #FF9800;
    color: white;
}

.addBtn:hover,
.smallAddBtn:hover {
    background-color: #FB8C00;
}

/* 更新按鈕 - 藍色 */
.updateBtn,
.smallUpdateBtn {
    background-color: #2196F3;
    color: white;
}

.updateBtn:hover,
.smallUpdateBtn:hover {
    background-color: #1E88E5;
}

/* 排序按鈕 - 紫色 */
.sortBtn,
.smallSortBtn {
    background-color: #9C27B0;
    color: white;
}

.sortBtn:hover,
.smallSortBtn:hover {
    background-color: #8E24AA;
}

.saveBtn,
.smallSaveBtn {
    background-color: #00BCD4;  /* 青色 */
    color: white;
}

.saveBtn:hover,
.smallSaveBtn:hover {
    background-color: #00ACC1;  /* 懸停時變深 */
}


/* 按下時的效果（所有按鈕） */
button:active {
    transform: scale(0.85);
}

button:hover {
    transform: scale(1.05);
}

/* 調整間距 */
.controls {
    display: flex;
    gap: 15px;
    align-items: center;
}

.details-controller {
    margin-top: 20px;
}

/* 共用的按鈕樣式 */
.normalBtn,
.sortBtn,
.removeBtn,
.updateBtn,
.addBtn,
.smallNormalBtn,
.smallSortBtn,
.smallRemoveBtn,
.smallUpdateBtn,
.smallAddBtn,
.smallSaveBtn {
    border: none;
    border-radius: 15x;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0 15px;
    display: inline-flex;
    border: 2px black solid;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>