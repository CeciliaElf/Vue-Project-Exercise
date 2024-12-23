<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import Button from './BaseButton.vue'
import InputBar from './InputBar.vue';

const router = useRouter()
const newTodoTitle = ref('')      // 新增代辦事項
const todoList = ref([
    {
        id: 1,
        text: '',
        completed: false,
        details: [
            {
                id: 1,
                text: '',
                priority: 'medium',     // 優先級  htgh medium low
                dueTime: '',            // 截止時間
                createTime: '',         // 創建時間
                updateTime: '',         // 更新時間
            }
        ]
    }
])     

onMounted(() => {
    const saveTodos = localStorage.getItem('todoList')
    if (saveTodos) {
        todoList.value = JSON.parse(saveTodos) // 將字符串轉換為 JavaScript 對象
    }
})

// 監聽 todoList 的變化，把數據保存到 localStorage中
watch(todoList, (newValue) => {
    localStorage.setItem("todoList", JSON.stringify(newValue))
}, { deep: true })

// 傳統的 for 循環方法
/**
 * let isDuplicate = false
    for (let item of todoList.value) {
        if (item.text.trim() === newTodoTitle.value.trim()) {
            isDuplicate = true
            break
        }
    }
 */
// 建議使用數組中的 some 方法，會便利數組
/**
 *  some() 方法的特點：
    只要找到一個符合條件的元素就返回 true
    如果沒有找到符合條件的元素，返回 false
    一旦找到符合條件的元素，就會停止遍歷
    不會改變原數組
    對空數組返回 false
 */
const addToDo = () => {
    if (newTodoTitle.value.trim()) {
        const isDuplicate = todoList.value.some(
            item => {
                return item.text.trim() === newTodoTitle.value.trim()
            }
        )
        if(isDuplicate) {
            alert('已有同名標題哦，換一個名字吧~')
            return
        }
        if (newTodoTitle.value.length > 20) {
            alert('超過20字啦！標題不能超過20字')
            return
        }
        todoList.value.push({
            text: newTodoTitle.value,
            completed: false,
            details: [{
                id: Date.now(),
                text: '',
                priority: 'medium',
                dueTime: '',
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
            }]
        })
        newTodoTitle.value = ''
    } else if (!newTodoTitle.value) {
            alert('必須輸入標題哦~')
    }
}

const removeToDo = (index) => {
    todoList.value.splice(index, 1)
}

const addDetail = (id) => { 
    const todoItem = todoList.value[id]
    console.log('傳遞的文本：', todoItem.text)
    router.push({
        name: 'details',
        params: {id, text: todoItem.text},
    })
}

// 表示編輯狀態的變量 editingIndex
const editingIndex = ref(-1)
const changeTitle = (index) => {
    editingIndex.value = index
}

const count = ref(0)
const saveTitle = (index) => {
    const newTitle = todoList.value[index].text.trim()
    if (!newTitle) {
        count.value++
        alert('必須輸入標題哦~')
        todoList.value[index].text = todoList.value[index].text || `未命名事項${ count.value }` 
        editingIndex.value = -1
        return
    }
    
    const isDuplicate = todoList.value.some((item, currentIndex) => {
        return currentIndex !== index && item.text.trim() === newTitle
    })
    
    if (isDuplicate) {
        alert('已有同名標題哦，換一個名字吧~')
        return
    }
    
    editingIndex.value = -1
}

const toggleCompletedToDo = (index) => {
    todoList.value[index].completed = !todoList.value[index].completed
}
</script>

<template>
    <div class="root">
        <!-- 新增待辦事項 -->
        <div class="toDoList-left">
            <h1 class="title">To Do List</h1>
            <div class="inputToDo">
                <InputBar type="inputText" 
                            hint="請輸入代辦事項標題，按enter鍵存入"
                            v-model="newTodoTitle"
                            @keyup.enter="addToDo"/>
            </div>
            <Button text="新增事項" type="normal" @click="addToDo" />
        </div>

        <!-- 待辦事項列表 -->
        <div class="toDoList-right">
            <ul class="todolistTable">
                <li v-for="(item, index) of todoList" :key="index">
                    <span :class="{ completed: item.completed }" 
                        @click="toggleCompletedToDo(index)"
                        v-if="editingIndex != index">
                        {{ item.text }}
                    </span>
                    <InputBar 
                        v-else
                        type="inputTextChange"
                        hint="此處修改標題"
                        v-model="item.text"
                        @keyup.enter="saveTitle(index)"
                        ref="editingInput"
                        @blur="saveTitle(index)"
                        v-focus/>
                    <Button text="移除" type="smallRemove" @click="removeToDo(index)" />
                    <Button text="修改標題" type="smallUpdate" @click="changeTitle(index)" />
                    <Button text="新增詳情" type="smallAdd" @click="addDetail(index)" />
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@import url('../assets/root.css');
/* 左邊區域 */
.toDoList-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    gap: 15px; /* 使用 gap 控制元素间距 */
}

/* 標題樣式 */
.title {
    font-family: 'Arial', sans-serif;
    font-size: 2.2em;
    color: #333;
    margin-bottom: 20px;
}

/* 輸入框樣式 */
.inputToDo {
    margin-bottom: 15px;
}

/* 右邊區域 */
.toDoList-right {
    flex: 2;
    padding-left: 20px;
    height: 100%; /* 设定高度为100% */
    overflow: hidden; /* 防止容器本身滚动 */
    display: flex;
    flex-direction: column;
}

.todolistTable {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow-y: auto; /* 添加垂直滚动条 */
    flex: 1; /* 占据剩余空间 */
    padding-right: 10px; /* 为滚动条预留空间 */
}

/* 每個待辦項目 */
.todolistTable li {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    gap: 15px;
    /* 按鈕之間的間距 */
}

.todolistTable li span {
    flex: 1;
}

.todolistTable li:hover {
    transform: translateX(5px);
    /* 項目懸停時右移 */
}

/* 已完成的項目 */
.completed {
    text-decoration: line-through;
    color: #aaa;
    position: relative;
    cursor: pointer;
}

.completed::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #aaa;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease-in-out;
}

.completed:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

/* 美化滚动条 */
.todolistTable::-webkit-scrollbar {
    width: 6px;
}

.todolistTable::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.todolistTable::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.todolistTable::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* 左邊區域 */
.toDoList-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    height: 100%; /* 设置高度为100% */
}
</style>