<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from './BaseButton.vue'
import { useRouter, useRoute } from 'vue-router';
import InputBar from './InputBar.vue';

const router = useRouter()
const route = useRoute()
const todoItemText = ref('')  // 使用 ref 來確保響應性
const todoId = ref('')

onMounted(() => {
    // 在組件掛載時獲取路由參數
    todoItemText.value = route.params.text
    todoId.value = route.params.id 
    const getStoredData = localStorage.getItem(`todo_detail_${ todoId.value }`)
    if (getStoredData) {
        details.value = JSON.parse(getStoredData)
    }
    console.log('路由參數：', route.params) // 用於調試
})

// 詳情數據
const details = ref([])
const newDetailData = ref('')
const searchQuery = ref('')
const sortBy = ref('createTime')  // 排序方式
const sortOrder = ref('desc')    // 排序順序

// 優先級
const priorities = [
    { value: 'high', label: '高', color: '#ff4d4f' },
    { value: 'medium', label: '中', color: '#faad14' },
    { value: 'low', label: '低', color: '#52c41a'},
]

// 新增詳情
const addDetail = () => {
    if (newDetailData.value.trim()) {
        // 使用 ISO 標準返回 Date 對象的字符串格式
        const now = new Date().toISOString()
        details.value.push({
            id: Date.now(),
            text: newDetailData.value,
            completed: false,
            priority: 'medium',
            dueDate: '',
            createTime: now,
            updateTime: now
        })
    } else if (newDetailData.value.trim() === '') {
        alert('詳情不能為空哦~')
    }
    newDetailData.value  = ''
    saveToLocalStorage()
}

// 搜索和排序後的詳情列表
const filteredAndSortedDetails = computed(() => {
    let result = [...details.value]
    // 搜索過濾
    if (searchQuery.value) {
        result = result.filter(details => 
            details.text.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
        )
    }
    // 排序
    result.sort((a, b) => {
        let compareA = a[sortBy.value]
        let compareB = b[sortBy.value]

        // 處理日期類型的比較
        if (sortBy.value === 'createTime' || sortBy.value === 'updateTime') {
            compareA = new Date(compareA).getTime()
            compareB = new Date(compareB).getTime()
        }
        // 處理優先級比較
        else if (sortBy.value === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            compareA = priorityOrder[compareA]
            compareB = priorityOrder[compareB]
        }
        // 處理截止日期的比較
        else if (sortBy.value === 'dueDate') {
            compareA = compareA ? new Date(compareA).getTime() : 0
            compareB = compareB ? new Date(compareB).getTime() : 0
        }

        // 根據排序順序返回結果
        if (sortOrder.value === 'desc') {
            return compareB - compareA
        } else {
            return compareA - compareB
        }
    })
    return result
})


// 編輯詳情
const editingIndex = ref('-1')
const editText = ref('')

const startEdit = (details) => {
    editingIndex.value = details.id
    editText.value = details.text
}

// 修改詳情
const saveEdit = (details) => {
    if (editText.value.trim()) {
        details.text = editText.value
        details.updateTime = new Date().toISOString()
        editingIndex.value = -1
        saveToLocalStorage()
    }
}

// 刪除詳情
const deleteDetail = (id) => {
    const index = details.value.findIndex(item => item.id === id)
    if (index > -1) {
        details.value.splice(index, 1)
        saveToLocalStorage()
    }
}

// 更新優先級
const updatePriority = (details, priority) => { 
    details.priority = priority
    details.updateTime = new Date().toISOString()
    saveToLocalStorage()
}

//更新截止日期
const updateDueTime = (details, dueDateTime) => {
    details.dueDate = dueDateTime
    details.updateTime = new Date().toISOString()
    saveToLocalStorage()
}

// 保存數據
const saveToLocalStorage = () => {
    localStorage.setItem(`todo_detail_${ todoId.value }`, JSON.stringify(details.value))
}

const toggleCompleted = (item) => {
    item.completed = !item.completed
    saveToLocalStorage()
}

const getPriorityColor = (priorityValue) => {
    const priority = priorities.find(p => p.value === priorityValue)
    return priority ? priority.color : '#000000'
}

</script>

<template>
    <div class="root">
        <div class="detail-container-left">
            <h1 class="title">{{ todoItemText }}</h1>
            <Button 
                @click="router.push('/')"
                text="返回" 
                type="normal" />
        </div>

        <div class="detail-container-right">
            <!-- 搜索和排序區域 -->
            <div class="controls">
                <InputBar 
                    type="inputTextChange"
                    hint="搜索詳情..."
                    v-model="searchQuery"/>
                <select class="sortLabel" v-model="sortBy">
                    <option value="createTime">創建時間</option>
                    <option value="updateTime">更新時間</option>
                    <option value="priority">優先級</option>
                    <option value="dueDate">截止日期</option>
                </select>
                <Button 
                    type="sort" 
                    :text="sortOrder === 'desc' ? '降序' : '升序'" 
                    @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'" />
            </div>

            <!-- 新增詳情 -->
            <div class="add-details">
                <InputBar
                    v-model="newDetailData"
                    type="inputTextChange"
                    hint="新增詳情..."
                    :style="{ marginRight: '15px' }"
                    @keyup.enter="addDetail()"/>
                <Button
                    type="add"
                    @click="addDetail()"
                    text="新增詳情"/>
            </div>
            <!-- 詳情列表 -->
            <ul class="detailList">
                <li v-for="item of filteredAndSortedDetails" 
                    :key="item.id">
                    <!-- 詳情內容 -->
                    <div class="detail-content">
                        <template v-if="editingIndex === item.id">
                            <InputBar
                                    v-model="editText" 
                                    type="inputTextChange"
                                    @keyup.enter="saveEdit(item)"
                                    @blur="saveEdit(item)"/>
                        </template>
                        <template v-else>
                            <span 
                                :class="{ completed: item.completed }"
                                @click="toggleCompleted(item)" >{{ item.text }}</span>
                                <Button
                                        text="修改詳情"
                                        type="smallUpdate"
                                        @click="startEdit(item)"/>
                                <Button
                                        text="刪除詳情"
                                        type="smallRemove"
                                        @click="deleteDetail(item.id)"/>
                        </template>
                    </div>
                    <!-- 詳情控制項 -->
                    <div class="detail-controls">
                        <!-- 優先級選擇 -->
                        <span class="menu-span">优先级选择：</span>
                        <select
                                v-model="item.priority"
                                @change="updatePriority(item, $event.target.value)"
                                :style="{ color: getPriorityColor(item.priority) }">
                            <option v-for="priority in priorities"
                                    :key="priority.value"
                                    :value="priority.value"
                                    :style="{ color: priority.color }">
                                {{ priority.label }}
                            </option>
                        </select>
                        <!-- 截止日期 -->
                        <span class="menu-span">截止日期：</span>
                        <input 
                            type="date"
                            :value="item.dueDate"
                            @change="updateDueTime(item, $event.target.value)">
                        <!-- 時間更新 -->
                        <div class="detail-time">
                            <small>創建：{{ new Date(item.createTime).toLocaleString() }}</small>
                            <small>更新：{{ new Date(item.updateTime).toLocaleString() }}</small>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@import url('../assets/root.css');

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

.detail-container-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
}

/* 右侧容器样式 */
.detail-container-right {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%; /* 设置高度为100% */
    overflow: hidden; /* 防止容器本身出现滚动条 */
}

.controls {
    display: flex;
    align-items: center;
    gap: 15px; /* 控制按鈕和輸入框之間的間距 */
}

.sortLabel {
    width: 20%;
    padding: 10px;
    font-size: 0.95em;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s ease;
}
/* 修改 detail-content 的樣式 */
.detail-content {
    display: flex;
    align-items: center;
    gap: 20px;  /* 增加元素之間的間距 */
    width: 100%;
}

/* 修改 span 元素的樣式 */
.detail-content span {
    flex: 1;
    margin-right: 30px;  /* 文字和按鈕之間增加間距 */
}

/* 修改按鈕容器的樣式 */
.button-group {
    display: flex;
    gap: 15px;  /* 按鈕之間的間距 */
    flex-shrink: 0;  /* 防止按鈕被擠壓 */
}

/* 詳情列表容器 */
.detailList {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden; 
    flex: 1;
}

.detailList::-webkit-scrollbar {
    width: 8px;
}

.detailList::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.detailList::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.detailList::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* 詳情項目 */
.detailList li {
    background: white;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detailList li:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 詳情內容區域 */
.detail-content {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.menu-span {
    font-size: 0.9em;
    color: #666;
    min-width: 80px; /* 确保标签宽度一致 */
}

/* 詳情控制項區域 */
.detail-controls {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-top: 8px;
}

/* 控制項懸停效果 */
.detail-controls select:hover,
.detail-controls input[type="date"]:hover {
    border-color: #40a9ff;
}

/*添加一些過渡效果 */
.detail-controls select,
.detail-controls input[type="date"] {
    transition: all 0.3s ease;
}
/* 優先級選擇器 */
select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9em;
    min-width: 100px;
    background-color: white;
    transition: all 0.3s ease;
}

/* 日期選擇器 */
input[type="date"] {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9em;
    color: #666;
    background-color: white;
    min-width: 130px; /* 统一日期选择器宽度 */
}

/* 時間信息區域 */
.detail-time {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: auto; /* 将时间讯息推到右侧 */
    min-width: 200px; /* 确保时间讯息有足够的空间 */
}

.detail-time small {
    color: #888;
    font-size: 0.85em;
}

/* 控制區域樣式 */
.controls {
    background: white;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
}

/* 新增詳情區域 */
.add-details {
    background: white;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
}
</style>