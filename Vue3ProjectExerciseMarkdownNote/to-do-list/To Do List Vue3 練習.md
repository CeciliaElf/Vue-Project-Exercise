# Vue3 練習 1 — 簡單的 To Do List

## 1.  Vue 項目框架搭建

1. 使用`npm`命令創建一個`Vue3`的項目框架

   > ```
   > npm init vue@latest
   > ```

2. 在執行完命令後會讓輸入項目的名稱

   > ```
   > D:\WorkBox\LearnCoding\Vue3ProjectExercise>npm init vue@latest
   > 
   > Vue.js - The Progressive JavaScript Framework
   > 
   > ? Project name: » to-do-list
   > ```

3. 自行選擇配置選項

   > ```
   > √ Project name: ... to-do-list
   > √ Package name: ... to-do-list
   > √ Add TypeScript? ... No / Yes
   > √ Add JSX Support? ... No / Yes
   > √ Add Vue Router for Single Page Application development? ... No / Yes
   > √ Add Pinia for state management? ... No / Yes
   > √ Add Vitest for Unit Testing? ... No / Yes
   > √ Add an End-to-End Testing Solution? » No
   > √ Add ESLint for code quality? » No
   > ```

4. 選擇完成後，運行給出的三條命令來完成最後的環境安裝 

   > **然後，刪除掉用不到的組件和樣式。至此，框架搭建就完成了**
   >
   > ```
   > cd toDoList
   > npm install
   > npm run dev
   > ```
   >
   > ![](D:\WorkBox\LearnCoding\Vue3ProjectExerciseMarkdownNote\to-do-list\pics\to-do-list-pic01.png)
   

## 2. 完成主界面：todolist.vue

1. 在`src`資料夾下開啟`components`資料夾，創建`todolist.vue`檔案。

### 2.1 編寫基本骨架

1. 編寫基本骨架

   > **對頁面進行分析：**
   >
   > 1. 分為兩個部分，左半邊為功能區域，右半部分為顯示區域。
   > 2. 左半邊有標題，一個輸入框，一個添加事項的按鈕
   > 3. 右半邊為展示添加好的List列表數據，每個數據後擁有三個功能：移除事項，修改標題，以及新增詳情
   >
   > **分析完後，開始完成基礎骨架的部分**
   >
   > **註：`<InputBar/> & <Button/>`是一個自定義的組件，在後面會有具體實現的程式碼**
   >
   > ```vue
   > <template>
   > 	<div class="root">
   >         <!-- 新增待辦事項 -->
   >         <div class="toDoList-left">
   >         	<h1>To Do List</h1>
   >         	<InputBar
   >                 type="inputText"
   >                	hint="請輸入待辦事項標題，按enter鍵存入"
   >                	v-model="newTodoTitle"
   >                 @keyup.enter="addToDo"/>
   >     	</div>
   >         <Button
   >                 text="新增事項"
   >                 type="normal"
   >                 @click="addToDo"/>
   >         <!-- 待辦事項列表 -->
   >         <div class="todoList-right">
   >             <ul class=todolistTable>
   >                 <li v-for="(item, index) of todoList" 
   >                     :key="index">
   >                     <span 
   >                          :class="completed: item.completed"
   >                          @click="toggleCompletedToDo(index)"
   >                          v-if="editingIndex != index">
   >                         {{ item.text }}
   >     				</span>
   >                     <InputBar
   >                               v-else
   >                               hint="此處修改標題"
   >                               v-model="item.text"
   >                               @keyup.enter="saveTitle(index)"
   >                               ref="editingInput"
   >                               @blur="saveTitle(index)"
   >                               v-focus/>
   >                     <Button text="移除" type="smallRemove" @click="removeToDo(index)"/>
   >                     <Button text="修改標題" type="smallUpdate" @click="changeTitle(index)"/>
   >                     <Button text="新增詳情" type="smallAdd" @click="addDetail(index)"/>
   >     			</li>
   >     		</ul>
   >     	</div>
   >     </div>
   > </template>
   > ```

### 2.2 編寫 css 美化頁面

1. 編寫`css`美化頁面

   > **root.css**
   >
   > 為了方便，適當簡化程式碼，在`assets`資料夾下創建`root.css`檔案來進行一個整體的固定樣式。
   >
   > ```css
   > /* root.css */
   > .root {
   >     display: flex;
   >     justify-content: space-between;
   >     /* 左右分佈 */
   >     align-items: flex-start;
   >     /* 垂直對齊到頂部 */
   >     width: 80%;
   >     /* 容器寬度佔 80% */
   >     max-width: 1200px;
   >     /* 最大寬度 */
   >     margin: 50px auto;
   >     /* 自動左右居中，並與頂部保持 50px 距離 */
   >     height: 600px;
   >     /* 固定高度 */
   >     border-radius: 12px;
   >     /* 圓角邊框 */
   >     background-color: #f9f9f9;
   >     /* 淺灰色背景 */
   >     box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
   >     /* 輕微陰影 */
   >     padding: 30px;
   >     overflow: hidden;
   > }
   > ```
   >
   > 
   >
   > ```vue
   > <style scoped>
   > @import url('../assets/root.css');
   > /* 左邊區域 */
   > .toDoList-left {
   >     flex: 1;
   >     display: flex;
   >     flex-direction: column;
   >     padding-right: 20px;
   >     gap: 15px; /* 使用 gap 控制元素间距 */
   > }
   > 
   > /* 標題樣式 */
   > .title {
   >     font-family: 'Arial', sans-serif;
   >     font-size: 2.2em;
   >     color: #333;
   >     margin-bottom: 20px;
   > }
   > 
   > /* 輸入框樣式 */
   > .inputToDo {
   >     margin-bottom: 15px;
   > }
   > 
   > /* 右邊區域 */
   > .toDoList-right {
   >     flex: 2;
   >     padding-left: 20px;
   >     height: 100%; /* 设定高度为100% */
   >     overflow: hidden; /* 防止容器本身滚动 */
   >     display: flex;
   >     flex-direction: column;
   > }
   > 
   > .todolistTable {
   >     list-style-type: none;
   >     padding: 0;
   >     margin: 0;
   >     overflow-y: auto; /* 添加垂直滚动条 */
   >     flex: 1; /* 占据剩余空间 */
   >     padding-right: 10px; /* 为滚动条预留空间 */
   > }
   > 
   > /* 每個待辦項目 */
   > .todolistTable li {
   >     cursor: pointer;
   >     display: flex;
   >     justify-content: space-between;
   >     align-items: center;
   >     padding: 12px;
   >     margin-bottom: 10px;
   >     background-color: #fff;
   >     border-radius: 8px;
   >     box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
   >     transition: transform 0.3s ease;
   >     gap: 15px;
   >     /* 按鈕之間的間距 */
   > }
   > 
   > .todolistTable li span {
   >     flex: 1;
   > }
   > 
   > .todolistTable li:hover {
   >     transform: translateX(5px);
   >     /* 項目懸停時右移 */
   > }
   > 
   > /* 已完成的項目 */
   > .completed {
   >     text-decoration: line-through;
   >     color: #aaa;
   >     position: relative;
   >     cursor: pointer;
   > }
   > 
   > .completed::after {
   >     content: '';
   >     position: absolute;
   >     bottom: 0;
   >     left: 0;
   >     width: 100%;
   >     height: 2px;
   >     background-color: #aaa;
   >     transform: scaleX(0);
   >     transform-origin: bottom right;
   >     transition: transform 0.3s ease-in-out;
   > }
   > 
   > .completed:hover::after {
   >     transform: scaleX(1);
   >     transform-origin: bottom left;
   > }
   > 
   > /* 美化滚动条 */
   > .todolistTable::-webkit-scrollbar {
   >     width: 6px;
   > }
   > 
   > .todolistTable::-webkit-scrollbar-track {
   >     background: #f1f1f1;
   >     border-radius: 3px;
   > }
   > 
   > .todolistTable::-webkit-scrollbar-thumb {
   >     background: #888;
   >     border-radius: 3px;
   > }
   > 
   > .todolistTable::-webkit-scrollbar-thumb:hover {
   >     background: #555;
   > }
   > 
   > /* 左邊區域 */
   > .toDoList-left {
   >     flex: 1;
   >     display: flex;
   >     flex-direction: column;
   >     padding-right: 20px;
   >     height: 100%; /* 设置高度为100% */
   > }
   > </style>
   > ```

2. 完成交互程式碼，讓頁面動起來~

   > **完成了骨架和`css`的程式碼後，大致可以得到一個靜態的潔面露，下面加入`script`讓頁面具有交互性來完成想要的結果。**
   >
   > **分析：**
   >
   > 1. 由於 ToDoList 項目有一個主頁面`todolist.vue`頁面，還有一個詳情頁面`tododetails.vue`，因此我們可以考慮使用`router`路由來進行頁面的跳轉，因此在寫 script 程式碼之前，需要安裝好`router`路由。
   >
   > 2. 使用`npm install vue-router@next`來安裝`router`所需要的包
   >
   > 3. 分析需要用到的`const`常數：
   >
   >    - 在輸入框新增一個事項時，需要一個常數來接收進去來配合`addDetail`函式來完成對數據的添加，而且我們還需要一個陣列來對具體的事項來進行保存，那麼我們就得到了兩個必須要有的常數：
   >
   >      ```javascript
   >      const newTodoTitle = ref('')  // 為了響應式，這裡定義為ref變								 數
   >      const todoList = ref([
   >          // 我們還要在陣列中定義一些對象，來具體化我們的陣列
   >          {
   >              id: 1,
   >              text: '',
   >              completed: false,
   >              details: [
   >                  {
   >                      id: 1,
   >                      text: '',
   >                      priority: 'medium',  // 優先級
   >                      dueTime: '',         // 截止時間
   >                      createTime: '',      // 創建時間
   >                      updateTime: '',      // 更新時間
   >                  }
   >              ]
   >          }
   >      ])
   >      ```
   >
   >    - 由於我們還需要用到路由，所有在 script 中還需要引入 Vue 路由來進行頁面的切換。
   >    
   >      ```javascript
   >      import { useRouter } from 'vue-router'
   >      const router = useRouter()
   >      ```
   >    
   >    - 我們還需要對 DOM 進行一些操作，例如對組件渲染之後的元素進行操作（例如使用瀏覽器JSON保存數據，目的是為了在關閉或刷新瀏覽器的時候數據不會丟失），這時候要想到用 onMounted
   >    
   >    - 對於上面的常數 `const todoList`，我們還要監聽它的變化，如果裡面的數據進行了變動，我們需要作出相應的改變，把數據保存下來，這時 Vue3 中的 watch 就派上了用場。
   >    
   >    - 下面就可以對 script 進行編寫了
   >

### 2.3 路由搭建 index.js

- 由於前面提到，需要使用到頁面跳轉，因此我們最好引入路由來實現該功能。

> ```javascript
> import ToDoList from '../components/todolist.vue'
> import ToDoDetails from '../components/tododetails.vue'
> import { createRouter, createWebHistory } from 'vue-router'
> 
> const routes = [
>     {
>         path: '',
>         name: 'home',
>         component: ToDoList,
>     },
>     {
>         path: '/details/:id/:text',
>         name: 'details',
>         component: ToDoDetails,
>         props: true,
>     },
> ]
> 
> export default createRouter({
>     history: createWebHistory(),
>     routes
> })
> ```

#### 2.3.1 createWebHistory() 

##### 2.3.1.1 基本概念

`createWebHistory` 是 Vue Router 4.x 版本中用於創建 HTML5 模式路由歷史記錄的函數。它使用瀏覽器的 History API，產生乾淨的 URL（沒有 `#` 號）。

##### 2.3.1.2 基本用法

> ```javascript
> // router/index.js
> import { createRouter, createWebHistory } from 'vue-router'
> 
> const router = createRouter({
>   history: createWebHistory(),
>   routes: [
>     // 路由配置
>   ]
> })
> ```

##### 2.3.1.3 配置選項

1. **基礎路徑配置**

   > ```javascript
   > // 默認配置
   > createWebHistory()
   > 
   > // 帶基礎路徑的配置
   > createWebHistory('/app/') // URL 會變成 /app/your-route
   > ```

2. **完整路由配置示例**

   > ```javascript
   > import { createRouter, createWebHistory } from 'vue-router'
   > 
   > const router = createRouter({
   >   history: createWebHistory(import.meta.env.BASE_URL),
   >   routes: [
   >     {
   >       path: '/',
   >       name: 'home',
   >       component: () => import('@/views/HomeView.vue')
   >     },
   >     {
   >       path: '/about',
   >       name: 'about',
   >       component: () => import('@/views/AboutView.vue')
   >     }
   >   ]
   > })
   > ```
   >
   > `import.meta.env.BASE_URL` **是 Vite 提供的一個環境變量，用於設置應用的基礎 URL 路徑。它主要用於：**
   >
   > - 確定應用部署時的基礎路徑
   > - 處理靜態資源的路徑
   > - 配置路由的基礎路徑

### 2.4 todolist.vue—script 中函式的實現

#### 2.4.1 onMounted 生命週期鉤子

- `onMounted` 是 Vue 的生命週期鉤子
- 在組件掛載完成後執行
- 確保 DOM 已經渲染完成
- 適合進行初始化操作

> ##### 完成代碼實現
>
> ```javascript
> onMounted(() => {
>     const saveTodos = localStorage.getItem('todoList')
>     if(saveTodos) {
>         todoList.value = JSON.parse(saveTodos)
>     }
> })
> ```
>
> #### 詳解：
>
> ##### localStorage 操作
>
> ```javascript
> const saveTodos = localStorage.getItem('todoList')
> ```
>
> - `localStorage` 是瀏覽器的本地存儲 API
> - `getItem()` 用於獲取存儲的數據
> - 'todoList' 是存儲的鍵名
> - 返回的數據是字符串格式
>
> ##### 條件判斷
>
> ```javascript
> if (saveTodos) {
>     // ...
> }
> ```
>
> - 檢查是否有已保存的數據
> - 防止 `null` 或 `undefined` 情況
> - 確保安全地處理數據
>
> ##### 數據轉換和賦值
>
> ```javascript
> todoList.value = JSON.parse(saveTodos)
> ```
>
> - `JSON.parse()` 將字符串轉換為 JavaScript 對象
> - `todoList.value` 表示這是一個 ref 響應式數據
> - 將解析後的數據賦值給 todoList

#### 2.4.2 watch 監聽 todoList 變化

##### 2.4.2.1 watch 函數

- Vue 的響應式 API
- 用於監聽響應式數據的變化
- 當數據變化時執行回調函數

> ##### 完成代碼實現
>
> ```javascript
> watch(todoList, (newValue) => {
>     localStorage.setItem('todoList', JSON.stringify(newValue))
> }, { deep: value })
> ```
>
> #### 詳解：
>
> ##### 監聽目標
>
> ```javascript
> // 示例：被監聽的數據結構
> const todoList = ref([
>     { id: 1, text: '學習 Vue', completed: false },
>     { id: 2, text: '寫代碼', completed: true }
> ])
> ```
>
> ##### 回調函數
>
> ```javascript
> (newValue) => {
>     // newValue 是更新後的值
>     localStorage.setItem("todoList", JSON.stringify(newValue))
> }
> 
> // 完整版本（包含舊值）
> watch(todoList, (newValue, oldValue) => {
>     console.log('新值：', newValue)
>     console.log('舊值：', oldValue)
>     localStorage.setItem("todoList", JSON.stringify(newValue))
> })
> ```
>
> #####  存儲操作
>
> ```javascript
> localStorage.setItem("todoList", JSON.stringify(newValue))
> ```
>
> - `JSON.stringify()` 將對象轉換為字符串
> - `localStorage.setItem()` 保存到本地存儲
>
> ##### 配置選項  { deep: true }
>
> - `deep: true` 啟用深度監聽
> - 監聽對象/數組的所有嵌套層級變化

#### 2.4.3 addTodo 函式實現

- 該函式的目的是在用戶在輸入框輸入完想要加入的事項後，可以把數據加入到存儲所有事項的 todoList 陣列裡。

> ```javascript
> const addTodo = () => {
>     if (newTodoTitle.value.trim()) {
>         // 檢測是否有同名標題
>         const isDuplicate = todoList.value.some(
>             item => item.text.trim() === newTodoTitle.value.trim()
>         )
>         if (isDuplicate) {
>             alert('已有同名標題哦，換一個名字吧~')
>             return
>         }
>         if (newTodoTitle.value.length > 20) {
>             alert(alert('超過20字啦！標題不能超過20字')
>             return
>         }
>         todoList.value.push({
>             text: newTodoTitle.value,
>             completed: false,
>             details: [{
>                 id: 1,
>                 text: '',
>                 priority: 'medium',
>                 dueTime: '',
>                 createTime: new Date().toISOSting(),
>                 updateTime: new Date().toISOString(),
>             }]
>         })
>         // 把 newTodoTitle 置空， 方便下一次輸入
>         newTodoTitle.value = ''
>     } else if (!newTodoTitle.value) {
>          alert('必須輸入標題哦~')
>     }
> }
> ```

#### 2.4.4 removeToDo 函式實現

- 刪除功能是必要的，如果用戶不想完成或做某個事項，可以自行刪除，代碼很簡單。

> ```javascript
> const removeToDo(index) => {
>     todoList.value.splice(index, 1)
> }
> ```

#### 2.4.5 addDetail 新增詳情 函式實現

- 在點擊新增詳情按鈕時，用戶會跳轉到新增詳情的界面

> ```javascript
> const addDetail = (id) {
>     const todoItem = todoList.value[id]
>     console.log('傳遞的文本：', todoItem)
>     router.push({
>         name: 'details',
>         params: { id, text: todoItem.text }
>     })
> }
> ```

##### 小疑問：name 和 params 是什麼？ 是自定義屬性嗎？

**！！！！！！！！！！！！！！！！不是的！！！！！！！！！！！！ ！！！！！**

`name` 是路由配置中的一個固定屬性名，但它的值是可以自定義的。這個值需要與路由配置文件中定義的路由名稱相對應。

###### name疑問 1. 路由配置示例

> ```javascript
> // router/index.js
> const routes = [
>   {
>     path: '/',
>     name: 'home',         // 自定義的路由名稱
>     component: HomeView
>   },
>   {
>     path: '/details/:id',
>     name: 'details',      // 自定義的路由名稱
>     component: DetailsView
>   },
>   {
>     path: '/user-profile',
>     name: 'userProfile',  // 自定義的路由名稱（可以使用駝峰式命名）
>     component: UserProfile
>   }
> ]
> ```

###### name疑問 2. 使用路由名稱

> ```javascript
> // 使用命名路由進行導航
> const router = useRouter()
> 
> // 方式 1：使用 name
> router.push({ name: 'details' })
> 
> // 方式 2：帶參數的命名路由
> router.push({ 
>     name: 'details',
>     params: { id: 123 }
> })
> 
> // 方式 3：帶查詢參數
> router.push({
>     name: 'userProfile',
>     query: { tab: 'settings' }
> })
> ```

###### name疑問 3. 實際應用示例

> ```javascript
> // 不同的導航方式
> const navigation = {
>   // 使用命名路由（推薦）
>   goToDetails() {
>     router.push({ name: 'details', params: { id: 123 }})
>   },
> 
>   // 使用路徑（不推薦）
>   goToDetailsPath() {
>     router.push('/details/123')
>   }
> ```

所以：

- `name` 是固定的屬性名
- `name` 的值（如 'details', 'home' 等）是自定義的
- 建議使用命名路由（name）而不是路徑（path），因為：
  - 更容易維護
  - 自動處理路徑編碼
  - 可以更容易地重構 URL 結構



###### params基本概念

`params` 是 Vue Router 中用於傳遞路由參數的一個特定屬性，主要用於在 URL 路徑中傳遞動態參數。

`params` 參數會直接體現在 URL 路徑中，例如：

> ```javascript
> // 路由配置
> const routes = [
>   {
>     path: '/user/:id',    // :id 是動態參數
>     name: 'user',
>     component: UserView
>   }
> ]
> 
> // 使用路由
> router.push({
>   name: 'user',
>   params: { id: '123' }   // 生成的 URL: /user/123
> })
> ```

###### params疑問 1. params vs query 的區別



```javascript
// 使用 params
router.push({
  name: 'user',
  params: { id: '123' }
}) 
// 結果: /user/123

// 使用 query
router.push({
  name: 'user',
  query: { id: '123' }
}) 
// 結果: /user?id=123
```

###### params疑問 2. 常見使用場景

1. **例：用戶詳情頁**

   > ```javascript
   > // 路由配置
   > {
   >   path: '/user/:id',
   >   name: 'userDetail',
   >   component: UserDetail
   > }
   > 
   > // 跳轉到用戶詳情
   > router.push({
   >   name: 'userDetail',
   >   params: { id: userId }
   > })
   > ```

2. **例：文章詳情頁**

   > ```javascript
   > // 路由配置
   > {
   >   path: '/article/:id/:slug',
   >   name: 'article',
   >   component: Article
   > }
   > 
   > // 跳轉到文章
   > router.push({
   >   name: 'article',
   >   params: { 
   >     id: '123',
   >     slug: 'my-article-title'
   >   }
   > })
   > // 生成的 URL: /article/123/my-article-title
   > ```

###### params疑問 3. 接收參數

> ```javascript
> // 在組件中使用
> import { useRoute } from 'vue-router'
> 
> const route = useRoute()
> 
> // 獲取參數
> const userId = route.params.id
> const articleSlug = route.params.slug
> 
> // 監聽參數變化
> watch(
>   () => route.params.id,
>   (newId) => {
>     // 參數變化時的處理邏輯
>     fetchUserData(newId)
>   }
> )
> ```

###### params疑問 4. 可選參數

> ```javascript
> // 路由配置
> {
>   path: '/user/:id?',  // 問號表示該參數可選
>   name: 'user',
>   component: UserView
> }
> 
> // 使用
> router.push({ name: 'user' })                    // /user
> router.push({ name: 'user', params: { id: 1 } }) // /user/1
> ```

###### params疑問 5. 參數驗證

> ```javascript
> {
>   path: '/user/:id(\\d+)',  // 只匹配數字
>   name: 'user',
>   component: UserView
> }
> ```

###### params疑問 6. 最佳實踐

> ```javascript
> // 1. 定義路由常量
> const ROUTES = {
>   USER_DETAIL: 'userDetail',
>   ARTICLE: 'article'
> }
> 
> // 2. 封裝導航方法
> const navigateToUser = (userId) => {
>   router.push({
>     name: ROUTES.USER_DETAIL,
>     params: { id: userId }
>   })
> }
> 
> // 3. 使用
> navigateToUser('123')
> ```

記住：

- `params` 參數會直接顯示在 URL 路徑中
- 必須在路由配置中聲明參數（使用 `:參數名`）
- 參數值會自動進行 URL 編碼
- 如果使用 `path` 而不是 `name`，則 `params` 會被忽略

#### 2.4.6 更改標題和保存標題的函式實現

- 如果用戶不小心輸入錯了事項標題或者說需要修改事項的標題，這是我們就需要考慮為我們的功能中加入修改的選項了。

> ```javascript
> const editingIndex = ref(-1)  // 未觸發編輯的時候為-1
> // 當用戶點擊標題的時候切換狀態，並定位到要改的標題index上
> const changeTitle = (index) => {
>     editingIndex.value = index
> }
> 
> const count = ref(0)
> const saveTitle = (index) => {
>     const newTitle = todoList.value[index].text.trim()
>     if (!newTitle) {
>         count.value++
>         alert('必須輸入標題哦~')
>         todoList.value[index].text = todoList.value[index].text || `未命名事項${ count.value }`
>         const isDuplicate = todoList.value.some((item, currentIndex) => {
>             // 避免出現自己和自己比的情況
>             return currentIndex !== index && item.text.trim() === newTitle
>         })
>         if (isDuplicate) {
>             alert('已有同名標題哦，換一個名字吧~')
>         	return
>         }
>         editingIndex.value = -1
>     }
> }
> ```

#### 2.4.7  切換完成狀態的函式

> ```javascript
> const toggleCompletedToDo = (index) => {
>     todoList.value[index].completed = !todoList.value[index].completed
> }
> ```

### 2.5 一些函式和方法的講解

#### 2.5.1 some方法

1. some() 方法：

   - **基本用途**

     - 用於檢測數組中是否至少有一個元素符合指定條件
     - 返回值為布爾值（`true` 或 `false`）
     - 不會改變原始數組

   - **語法：**

     > ```JavaScript
     > array.some(callback(element[, index[, array]])[, thisArg])
     > /*
     > 	element: 當前正在處理的元素
     >     index: 當前元素的索引（可選）
     >     array: 調用 some() 的數組本身（可選）
     >     thisArg（可選）:
     > 		執行 callback 函數時用作 this 的值
     > 		如果使用箭頭函數，則忽略 thisArg
     > */
     > ```

   - **使用示例：**

     > ```javascript
     > // 檢查數組中是否有大於 10 的數字
     > const numbers = [2, 5, 8, 12, 4];
     > const hasNumberOverTen = numbers.some(num => num > 10);
     > console.log(hasNumberOverTen); // 輸出: true
     > 
     > // 檢查數組中是否包含特定字符串
     > const fruits = ['apple', 'banana', 'orange'];
     > const hasApple = fruits.some(fruit => fruit === 'apple');
     > console.log(hasApple); // 輸出: true
     > ```

   - **重要特性：**

     - 當找到第一個符合條件的元素時立即返回 `true`，不會繼續遍歷
     - 如果沒有找到符合條件的元素，返回 `false`
     - 對空數組執行任何條件，返回值都是 `false`
     - 不會對空槽位（empty slots）執行回調函數

   - **效能考慮：**

     - 由於找到符合條件的元素就會停止遍歷，所以在大數組中查找元素時比較高效
     - 適合用於"至少一個"的邏輯判斷場景

   - **實際應用場景：**

     > ```javascript
     > // 檢查用戶權限
     > const userPermissions = ['read', 'write', 'delete'];
     > const canEdit = userPermissions.some(permission => permission === 'write');
     > 
     > // 表單驗證
     > const formValues = ['', 'test', ''];
     > const hasEmptyField = formValues.some(value => value === '');
     > ```
     >
     > **與其他數組方法的比較**
     >
     > - `every()`: 檢查所有元素是否都符合條件
     > - `find()`: 返回第一個符合條件的元素
     > - `includes()`: 檢查數組是否包含特定值
     > - `some()`: 檢查是否至少有一個元素符合條件
     >
     > `some()` 方法是函數式編程的一個很好例子，它使代碼更加簡潔和易讀，特別適合用於條件檢查的場景


#### 2.5.2 useRoute 和 useRouter 的區別和使用方式

##### 2.5.2.1 useRoute

- `useRoute` 主要用於**獲取當前路由信息**。

  > ```javascript
  > import { useRoute } from 'vue-router'
  > 
  > const route = useRoute()
  > 
  > // 常見用法
  > console.log(route.params.id)     // 路由參數
  > console.log(route.query.search)  // URL 查詢參數
  > console.log(route.path)          // 當前路徑
  > console.log(route.name)          // 路由名稱
  > console.log(route.meta)          // 路由元信息
  > ```

- 使用場景：

  1. 需要讀取路由參數時
  2. 需要根據當前路由信息進行條件渲染
  3. 需要獲取路由查詢參數進行數據過濾
  4. 需要讀取路由元信息時

##### 2.5.2.2 useRouter

- `useRouter` 主要用於**路由操作和導航**。

  > ```javascript
  > import { useRouter } from 'vue-router'
  > 
  > const router = useRouter()
  > 
  > // 常見用法
  > // 導航
  > router.push('/home')
  > router.push({ name: 'user', params: { id: '123' }})
  > router.replace('/about')
  > router.go(-1)
  > 
  > // 添加路由守衛
  > router.beforeEach((to, from) => {
  >   // ...
  > })
  > ```

- 使用場景：

  1. 編程式導航
  2. 需要操作路由歷史
  3. 動態添加路由
  4. 設置全局路由守衛

1. **實際應用示例：**

   - **表單提交後跳轉**

     > ```javascript
     > const router = useRouter()
     > 
     > const submitForm = async () => {
     >   try {
     >     await saveData()
     >     router.push('/success')
     >   } catch (error) {
     >     console.error(error)
     >   }
     > }
     > ```

   - **根據路由參數獲取數據**

     > ```javascript
     > const route = useRoute()
     > const { id } = route.params
     > 
     > // 使用 watch 監聽路由參數變化
     > watch(
     >   () => route.params.id,
     >   async (newId) => {
     >     await fetchData(newId)
     >   }
     > )
     > ```

   - **條件導航**

     > ```javascript
     > const router = useRouter()
     > const userStore = useUserStore()
     > 
     > const checkAndNavigate = () => {
     >   if (!userStore.isLoggedIn) {
     >     router.push({
     >       path: '/login',
     >       query: { redirect: router.currentRoute.value.fullPath }
     >     })
     >   }
     > }
     > ```

2. **使用建議**

   1. **使用 useRoute 的情況**：
      - 只需要讀取路由信息時
      - 在模板中直接使用路由參數時
      - 需要監聽路由參數變化時

   2. **使用 useRouter 的情況**：
      - 需要進行頁面跳轉時
      - 需要操作路由歷史時
      - 需要動態添加/修改路由時
      - 需要設置路由守衛時

#### 2.5.3 splice方法

##### 2.5.3.1 基本語法

```javascript
array.splice(startIndex, deleteCount, item1, item2, ...)
```

參數說明：

1. `startIndex`: 開始修改的位置
2. `deleteCount`: 要刪除的元素數量
3. `item1, item2, ...`: 要添加的新元素（可選）

##### 2.5.3.2 常見用法示例

1. **刪除元素**

   > ```javascript
   > const fruits = ['蘋果', '香蕉', '橙子', '葡萄']
   > 
   > // 刪除一個元素
   > fruits.splice(1, 1) // 從索引1開始刪除1個元素
   > console.log(fruits) // ['蘋果', '橙子', '葡萄']
   > 
   > // 刪除多個元素
   > fruits.splice(1, 2) // 從索引1開始刪除2個元素
   > console.log(fruits) // ['蘋果', '葡萄']
   > ```

2. **添加元素**

   > ```javascript
   > const numbers = [1, 2, 3, 4]
   > 
   > // 在索引2的位置添加新元素
   > numbers.splice(2, 0, 'new')
   > console.log(numbers) // [1, 2, 'new', 3, 4]
   > 
   > // 添加多個元素
   > numbers.splice(2, 0, 'a', 'b', 'c')
   > console.log(numbers) // [1, 2, 'a', 'b', 'c', 3, 4]
   > ```

3. **替換元素**

   > ```javascript
   > const colors = ['紅', '藍', '綠']
   > 
   > // 替換一個元素
   > colors.splice(1, 1, '黃')
   > console.log(colors) // ['紅', '黃', '綠']
   > 
   > // 替換多個元素
   > colors.splice(0, 2, '白', '黑')
   > console.log(colors) // ['白', '黑', '綠']
   > ```

## 3. 自定義組件編寫

### 3.1 InputBar 組件的實現

> ```javascript
> <script setup>
> defineProps({
>  type: {
>      type: String,
>      default: '',
>  },
>  hint: {
>      type: String,
>      required: true,
>  },
>  modelValue: {
>      type: String,
>      default: '',
>  }
> })
> const emit = defineEmits(['update: modelValue'])
> </script>
> 
> <template>
>  <input 
>      :class="`${type}`" 
>      :placeholder="`${hint}`"
>      :value="modelValue"
>      @input="emit('update:modelValue', $event.target.value)"
>  >
> </template>
> 
> <style scoped>
> .inputText {
>  width: 100%;
>  padding: 10px;
>  font-size: 1.1em;
>  border: 2px solid #ddd;
>  border-radius: 8px;
>  transition: border-color 0.3s ease;
> }
> 
> .inputTextChange {
>  width: 60%;
>  padding: 10px;
>  font-size: 0.95em;
>  border: 2px solid #ddd;
>  border-radius: 8px;
>  transition: border-color 0.3s ease;
> }
> </style>
> ```

### 3.2 Button 組件的實現

> ```vue
><script setup>
> defineProps({
>  text: {
>      type: String,
>         required: true
>     },
>     type: {
>         type: String,
>         default: 'normal',
>         validator: (value) => [
>             'normal', 'remove', 'add', 
>             'update', 'sort', 'smallNormal',
>             'smallRemove', 'smallAdd', 'smallUpdate',
>             'smallSort', 'smallSave'].includes(value)
>     }
>    })
>    const emit = defineEmits(['click'])
> const handleClick = () => {
>  emit('click')
> }
>    </script>
> 
> <template>
>  <button :class="`${type}Btn`"
>          @click="handleClick">{{ text }}</button>
>    </template>
>    
> <style scoped>
> /* 按鈕統一基礎樣式 */
> button {
>  display: inline-flex;
>  justify-content: center;
>     align-items: center;
>     font-family: 'Courier New', Courier, monospace;
>     font-weight: bold;
>     border-radius: 20px;
>     transition: transform 0.3s ease, background-color 0.3s ease;
>     border: 2px solid #000;
>    }
>    
> /* 基本按鈕大小 */
> .normalBtn,
> .sortBtn,
> .removeBtn,
> .updateBtn,
> .addBtn {
>  width: 150px;
>  height: 45px;
>     font-size: 1em;
>    }
>    
> /* small 按鈕系列 */
> .smallRemoveBtn,
> .smallUpdateBtn,
> .smallAddBtn,
> .smallNormalBtn,
> .smallSortBtn,
> .smallSortBtn,
> .smallSaveBtn {
>  width: 95px;
>  height: 35px;
>     font-size: 0.85em;
>    }
>    
> /* 返回按鈕 - 綠色 */
> .normalBtn,
> .smallNormalBtn {
>  background-color: #4CAF50;
>  color: white;
>    }
>    
> .normalBtn:hover,
> .smallNormalBtn:hover {
>  background-color: #45A049;
> }
>    
> /* 刪除按鈕 - 紅色 */
> .removeBtn,
> .smallRemoveBtn {
>  background-color: #F44336;
>  color: white;
>    }
>    
> .removeBtn:hover,
> .smallRemoveBtn:hover {
>  background-color: #E53935;
> }
>    
> /* 新增按鈕 - 橙色 */
> .addBtn,
> .smallAddBtn {
>  background-color: #FF9800;
>  color: white;
>    }
>    
> .addBtn:hover,
> .smallAddBtn:hover {
>  background-color: #FB8C00;
> }
>    
> /* 更新按鈕 - 藍色 */
> .updateBtn,
> .smallUpdateBtn {
>  background-color: #2196F3;
>  color: white;
>    }
>    
> .updateBtn:hover,
> .smallUpdateBtn:hover {
>  background-color: #1E88E5;
> }
>    
> /* 排序按鈕 - 紫色 */
> .sortBtn,
> .smallSortBtn {
>  background-color: #9C27B0;
>  color: white;
>    }
>    
> .sortBtn:hover,
> .smallSortBtn:hover {
>  background-color: #8E24AA;
> }
>    
> .saveBtn,
> .smallSaveBtn {
>  background-color: #00BCD4;  /* 青色 */
>  color: white;
>    }
>    
> .saveBtn:hover,
> .smallSaveBtn:hover {
>  background-color: #00ACC1;  /* 懸停時變深 */
> }
>    
> 
> /* 按下時的效果（所有按鈕） */
> button:active {
>  transform: scale(0.85);
> }
>    
> button:hover {
>  transform: scale(1.05);
> }
>    
> /* 調整間距 */
> .controls {
>  display: flex;
>  gap: 15px;
>     align-items: center;
>    }
>    
> .details-controller {
>  margin-top: 20px;
> }
>    
> /* 共用的按鈕樣式 */
> .normalBtn,
> .sortBtn,
> .removeBtn,
> .updateBtn,
> .addBtn,
> .smallNormalBtn,
> .smallSortBtn,
> .smallRemoveBtn,
> .smallUpdateBtn,
> .smallAddBtn,
> .smallSaveBtn {
>  border: none;
>  border-radius: 15x;
>     cursor: pointer;
>     transition: all 0.3s ease;
>     padding: 0 15px;
>     display: inline-flex;
>     border: 2px black solid;
>     align-items: center;
>     justify-content: center;
>     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
>    }
>    </style>
> ```
> 

## 4. 完整的 todolist.vue 程式碼

> ```vue
> <script setup>
> import { onMounted, ref, watch } from 'vue'
> import { useRouter } from 'vue-router';
> import Button from './BaseButton.vue'
> import InputBar from './InputBar.vue';
> 
> const router = useRouter()
> const newTodoTitle = ref('')      // 新增代辦事項
> const todoList = ref([
>  {
>      id: 1,
>      text: '',
>      completed: false,
>      details: [
>          {
>              id: 1,
>              text: '',
>              priority: 'medium',     // 優先級  htgh medium low
>              dueTime: '',            // 截止時間
>              createTime: '',         // 創建時間
>              updateTime: '',         // 更新時間
>          }
>      ]
>  }
> ])     
> 
> onMounted(() => {
>  const saveTodos = localStorage.getItem('todoList')
>  if (saveTodos) {
>      todoList.value = JSON.parse(saveTodos) // 將字符串轉換為 JavaScript 對象
>  }
> })
> 
> // 監聽 todoList 的變化，把數據保存到 localStorage中
> watch(todoList, (newValue) => {
>  localStorage.setItem("todoList", JSON.stringify(newValue))
> }, { deep: true })
> 
> // 傳統的 for 循環方法
> /**
>  * let isDuplicate = false
>     for (let item of todoList.value) {
>         if (item.text.trim() === newTodoTitle.value.trim()) {
>             isDuplicate = true
>             break
>         }
>     }
>  */
> // 建議使用數組中的 some 方法，會便利數組
> /**
>  *  some() 方法的特點：
>     只要找到一個符合條件的元素就返回 true
>     如果沒有找到符合條件的元素，返回 false
>     一旦找到符合條件的元素，就會停止遍歷
>     不會改變原數組
>     對空數組返回 false
>  */
> const addToDo = () => {
>     if (newTodoTitle.value.trim()) {
>         const isDuplicate = todoList.value.some(
>             item => {
>                 return item.text.trim() === newTodoTitle.value.trim()
>             }
>         )
>         if(isDuplicate) {
>             alert('已有同名標題哦，換一個名字吧~')
>             return
>         }
>         if (newTodoTitle.value.length > 20) {
>             alert('超過20字啦！標題不能超過20字')
>             return
>         }
>         todoList.value.push({
>             text: newTodoTitle.value,
>             completed: false,
>             details: [{
>                 id: Date.now(),
>                 text: '',
>                 priority: 'medium',
>                 dueTime: '',
>                 createTime: new Date().toISOString(),
>                 updateTime: new Date().toISOString(),
>             }]
>         })
>         newTodoTitle.value = ''
>     } else if (!newTodoTitle.value) {
>             alert('必須輸入標題哦~')
>     }
> }
> 
> const removeToDo = (index) => {
>     todoList.value.splice(index, 1)
> }
> 
> const addDetail = (id) => { 
>     const todoItem = todoList.value[id]
>     console.log('傳遞的文本：', todoItem.text)
>     router.push({
>         name: 'details',
>         params: {id, text: todoItem.text},
>     })
> }
> 
> // 表示編輯狀態的變量 editingIndex
> const editingIndex = ref(-1)
> const changeTitle = (index) => {
>     editingIndex.value = index
> }
> 
> const count = ref(0)
> const saveTitle = (index) => {
>     const newTitle = todoList.value[index].text.trim()
>     if (!newTitle) {
>         count.value++
>         alert('必須輸入標題哦~')
>         todoList.value[index].text = todoList.value[index].text || `未命名計劃${ count.value }` 
>         editingIndex.value = -1
>         return
>     }
> 
>     const isDuplicate = todoList.value.some((item, currentIndex) => {
>         return currentIndex !== index && item.text.trim() === newTitle
>     })
> 
>     if (isDuplicate) {
>         alert('已有同名標題哦，換一個名字吧~')
>         return
>     }
> 
>     editingIndex.value = -1
> }
> 
> const toggleCompletedToDo = (index) => {
>     todoList.value[index].completed = !todoList.value[index].completed
> }
> </script>
> 
> <template>
>     <div class="root">
>         <!-- 新增待辦事項 -->
>         <div class="toDoList-left">
>             <h1 class="title">To Do List</h1>
>             <div class="inputToDo">
>                 <InputBar type="inputText" 
>                             hint="請輸入代辦事項標題，按enter鍵存入"
>                             v-model="newTodoTitle"
>                             @keyup.enter="addToDo"/>
>             </div>
>             <Button text="新增事項" type="normal" @click="addToDo" />
>         </div>
> 
>         <!-- 待辦事項列表 -->
>         <div class="toDoList-right">
>             <ul class="todolistTable">
>                 <li v-for="(item, index) of todoList" :key="index">
>                     <span :class="{ completed: item.completed }" 
>                         @click="toggleCompletedToDo(index)"
>                         v-if="editingIndex != index">
>                         {{ item.text }}
>                     </span>
>                     <InputBar 
>                         v-else
>                         type="inputTextChange"
>                         hint="此處修改標題"
>                         v-model="item.text"
>                         @keyup.enter="saveTitle(index)"
>                         ref="editingInput"
>                         @blur="saveTitle(index)"
>                         v-focus/>
>                     <Button text="移除" type="smallRemove" @click="removeToDo(index)" />
>                     <Button text="修改標題" type="smallUpdate" @click="changeTitle(index)" />
>                     <Button text="新增詳情" type="smallAdd" @click="addDetail(index)" />
>                 </li>
>             </ul>
>         </div>
>     </div>
> </template>
> 
> <style scoped>
> @import url('../assets/root.css');
> /* 左邊區域 */
> .toDoList-left {
>     flex: 1;
>     display: flex;
>     flex-direction: column;
>     padding-right: 20px;
>     gap: 15px; /* 使用 gap 控制元素间距 */
> }
> 
> /* 標題樣式 */
> .title {
>     font-family: 'Arial', sans-serif;
>     font-size: 2.2em;
>     color: #333;
>     margin-bottom: 20px;
> }
> 
> /* 輸入框樣式 */
> .inputToDo {
>     margin-bottom: 15px;
> }
> 
> /* 右邊區域 */
> .toDoList-right {
>     flex: 2;
>     padding-left: 20px;
>     height: 100%; /* 设定高度为100% */
>     overflow: hidden; /* 防止容器本身滚动 */
>     display: flex;
>     flex-direction: column;
> }
> 
> .todolistTable {
>     list-style-type: none;
>     padding: 0;
>     margin: 0;
>     overflow-y: auto; /* 添加垂直滚动条 */
>     flex: 1; /* 占据剩余空间 */
>     padding-right: 10px; /* 为滚动条预留空间 */
> }
> 
> /* 每個待辦項目 */
> .todolistTable li {
>     cursor: pointer;
>     display: flex;
>     justify-content: space-between;
>     align-items: center;
>     padding: 12px;
>     margin-bottom: 10px;
>     background-color: #fff;
>     border-radius: 8px;
>     box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
>     transition: transform 0.3s ease;
>     gap: 15px;
>     /* 按鈕之間的間距 */
> }
> 
> .todolistTable li span {
>     flex: 1;
> }
> 
> .todolistTable li:hover {
>     transform: translateX(5px);
>     /* 項目懸停時右移 */
> }
> 
> /* 已完成的項目 */
> .completed {
>     text-decoration: line-through;
>     color: #aaa;
>     position: relative;
>     cursor: pointer;
> }
> 
> .completed::after {
>     content: '';
>     position: absolute;
>     bottom: 0;
>     left: 0;
>     width: 100%;
>     height: 2px;
>     background-color: #aaa;
>     transform: scaleX(0);
>     transform-origin: bottom right;
>     transition: transform 0.3s ease-in-out;
> }
> 
> .completed:hover::after {
>     transform: scaleX(1);
>     transform-origin: bottom left;
> }
> 
> /* 美化滚动条 */
> .todolistTable::-webkit-scrollbar {
>     width: 6px;
> }
> 
> .todolistTable::-webkit-scrollbar-track {
>     background: #f1f1f1;
>     border-radius: 3px;
> }
> 
> .todolistTable::-webkit-scrollbar-thumb {
>     background: #888;
>     border-radius: 3px;
> }
> 
> .todolistTable::-webkit-scrollbar-thumb:hover {
>     background: #555;
> }
> 
> /* 左邊區域 */
> .toDoList-left {
>     flex: 1;
>     display: flex;
>     flex-direction: column;
>     padding-right: 20px;
>     height: 100%; /* 设置高度为100% */
> }
> </style>
> ```

在完成上述所有代碼後，就可以得到一個完整的主頁面了：

![](D:\WorkBox\LearnCoding\Vue3ProjectExerciseMarkdownNote\to-do-list\pics\to-do-list-pic02.png)

## 5. 完成 新增詳情界面 tododetails.vue

### 5.1 完成基本骨架

- 現在我們來完成詳情頁面，同樣的，詳情界面也分為了同樣的兩部分，左半部分有顯示上一級新增事項的標題，一個新增詳情的輸入框，一個按鈕用於點擊加入詳情，右半邊則是顯示詳細訊息，以及模糊搜索，排序等功能。
- 為了美觀，我把詳情做成了類似於卡片的樣子，這樣可以方便用戶操作自己選擇的詳情條目

> ```vue
> <template>
>     <div class="root">
>         <div class="detail-container-left">
>             <h1 class="title">{{ todoItemText }}</h1>
>             <Button 
>                 @click="router.push('/')"
>                 text="返回" 
>                 type="normal" />
>         </div>
> 
>         <div class="detail-container-right">
>             <!-- 搜索和排序區域 -->
>             <div class="controls">
>                 <InputBar 
>                     type="inputTextChange"
>                     hint="搜索詳情..."
>                     v-model="searchQuery"/>
>                 <select class="sortLabel" v-model="sortBy">
>                     <option value="createTime">創建時間</option>
>                     <option value="updateTime">更新時間</option>
>                     <option value="priority">優先級</option>
>                     <option value="dueDate">截止日期</option>
>                 </select>
>                 <Button 
>                     type="sort" 
>                     :text="sortOrder === 'desc' ? '降序' : '升序'" 
>                     @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'" />
>             </div>
> 
>             <!-- 新增詳情 -->
>             <div class="add-details">
>                 <InputBar
>                     v-model="newDetailData"
>                     type="inputTextChange"
>                     hint="新增詳情..."
>                     :style="{ marginRight: '15px' }"
>                     @keyup.enter="addDetail()"/>
>                 <Button
>                     type="add"
>                     @click="addDetail()"
>                     text="新增詳情"/>
>             </div>
>             <!-- 詳情列表 -->
>             <ul class="detailList">
>                 <li v-for="item of filteredAndSortedDetails" 
>                     :key="item.id">
>                     <!-- 詳情內容 -->
>                     <div class="detail-content">
>                         <template v-if="editingIndex === item.id">
>                             <InputBar
>                                     v-model="editText" 
>                                     type="inputTextChange"
>                                     @keyup.enter="saveEdit(item)"
>                                     @blur="saveEdit(item)"/>
>                         </template>
>                         <template v-else>
>                             <span 
>                                 :class="{ completed: item.completed }"
>                                 @click="toggleCompleted(item)" >{{ item.text }}</span>
>                                 <Button
>                                         text="修改詳情"
>                                         type="smallUpdate"
>                                         @click="startEdit(item)"/>
>                                 <Button
>                                         text="刪除詳情"
>                                         type="smallRemove"
>                                         @click="deleteDetail(item.id)"/>
>                         </template>
>                     </div>
>                     <!-- 詳情控制項 -->
>                     <div class="detail-controls">
>                         <!-- 優先級選擇 -->
>                         <span class="menu-span">优先级选择：</span>
>                         <select
>                                 v-model="item.priority"
>                                 @change="updatePriority(item, $event.target.value)"
>                                 :style="{ color: getPriorityColor(item.priority) }">
>                             <option v-for="priority in priorities"
>                                     :key="priority.value"
>                                     :value="priority.value"
>                                     :style="{ color: priority.color }">
>                                 {{ priority.label }}
>                             </option>
>                         </select>
>                         <!-- 截止日期 -->
>                         <span class="menu-span">截止日期：</span>
>                         <input 
>                             type="date"
>                             :value="item.dueDate"
>                             @change="updateDueTime(item, $event.target.value)">
>                         <!-- 時間更新 -->
>                         <div class="detail-time">
>                             <small>創建：{{ new Date(item.createTime).toLocaleString() }}</small>
>                             <small>更新：{{ new Date(item.updateTime).toLocaleString() }}</small>
>                         </div>
>                     </div>
>                 </li>
>             </ul>
>         </div>
>     </div>
> </template>
> ```

#### 5.1.1 一些標籤講解

##### 5.1.1.1 select , option, small 標籤：

###### 1. select 標籤

用於創建下拉選單。

> ```html
> <!-- 基本用法 -->
> <select name="fruits">
>   <option value="apple">蘋果</option>
>   <option value="banana">香蕉</option>
>   <option value="orange">橘子</option>
> </select>
> 
> <!-- 常用屬性 -->
> <select 
>   name="fruits"
>   id="fruits"
>   multiple              // 允許多選
>   size="3"             // 同時顯示的選項數
>   disabled             // 禁用
>   required             // 必填
> >
>   <!-- 選項內容 -->
> </select>
> ```

###### 2. option 標籤

用於定義 `<select>` 中的選項。

> ```html
> <!-- 基本用法 -->
> <select>
>   <option value="1">選項一</option>
>   <option value="2" selected>選項二</option>  // selected 表示預設選中
>   <option value="3" disabled>選項三</option>  // disabled 表示禁用
> </select>
> 
> <!-- 使用 optgroup 分組 -->
> <select>
>   <optgroup label="水果">
>     <option value="apple">蘋果</option>
>     <option value="banana">香蕉</option>
>   </optgroup>
>   <optgroup label="蔬菜">
>     <option value="carrot">胡蘿蔔</option>
>     <option value="tomato">番茄</option>
>   </optgroup>
> </select>
> ```

###### 3. small 標籤

用於顯示較小的文字，通常用於附註說明。

> ```javascript
> <!-- 基本用法 -->
> <p>這是正常文字 <small>這是小字文字</small></p>
> 
> <!-- 常見用途 -->
> <h1>主標題 <small>副標題</small></h1>
> 
> <!-- 表單中的說明文字 -->
> <label for="username">用戶名</label>
> <input type="text" id="username">
> <small>用戶名長度必須在 3-20 個字符之間</small>
> 
> <!-- 版權信息 -->
> <footer>
>   <small>&copy; 2024 我的網站</small>
> </footer>
> ```

###### 4. 組合使用示例

> ```html
> <!-- HTML 表單示例 -->
> <div class="form-group">
>     <label for="countryRegion">選擇國家/地區：</label>
>     <select id="countryRegion" name="countryRegion" required>
>         <optgroup label="亞洲">
>             <option value="cn">中國</option>
>             <option value="tw">台灣</option>
>             <option value="hk">香港</option>
>             <option value="jp">日本</option>
>             <option value="kr">韓國</option>
>         </optgroup>
>         <optgroup label="歐洲">
>             <option value="uk">英國</option>
>             <option value="fr">法國</option>
>             <option value="de">德國</option>
>             <option value="it">義大利</option>
>             <option value="es">西班牙</option>
>             <option value="nl">荷蘭</option>
>         </optgroup>
>     </select>
>     <small>請選擇您所在的國家/地區</small>
> </div>
> 
> <!-- Vue.js 示例 -->
> <select v-model="selectedRegion">
>     <option v-for="region in countryRegions" 
>             :key="region.value" 
>             :value="region.value">
>         {{ region.text }}
>     </option>
> </select>
> <small>已選擇：{{ selectedRegion }}</small>
> 
> <script>
> // Vue.js 數據部分
> export default {
>     data() {
>         return {
>             selectedRegion: '',
>             countryRegions: [
>                 // 亞洲
>                 { value: 'cn', text: '中國' },
>                 { value: 'tw', text: '台灣' },
>                 { value: 'hk', text: '香港' },
>                 { value: 'jp', text: '日本' },
>                 { value: 'kr', text: '韓國' },
>                 // 歐洲
>                 { value: 'uk', text: '英國' },
>                 { value: 'fr', text: '法國' },
>                 { value: 'de', text: '德國' },
>                 { value: 'it', text: '義大利' },
>                 { value: 'es', text: '西班牙' },
>                 { value: 'nl', text: '荷蘭' }
>             ]
>         }
>     }
> }
> </script>
> ```

###### 5. CSS 樣式示例

> ```css
> /* select 樣式 */
> select {
>   padding: 8px;
>   border: 1px solid #ddd;
>   border-radius: 4px;
>   width: 200px;
> }
> 
> /* option 樣式 */
> option {
>   padding: 8px;
> }
> 
> /* small 樣式 */
> small {
>   color: #666;
>   font-size: 0.8em;
>   display: block;
>   margin-top: 5px;
> }
> 
> /* 錯誤提示樣式 */
> .error small {
>   color: red;
> }
> ```

###### 6. 響應式設計

```css
/* 響應式調整 */
@media (max-width: 768px) {
  select {
    width: 100%;
  }
  
  small {
    font-size: 0.7em;
  }
}
```

這些標籤各自有其特定用途：

- `<select>` 用於創建下拉選單
- `<option>` 用於定義選項
- `<small>` 用於顯示輔助性的小字文本

正確使用這些標籤可以提升表單的可用性和用戶體驗。

### 5.2 使用 css 美化

- 這這裡，由於之前編寫過 root.css，因此在 tododetails.vue 中，我們選擇直接引用 root.css 的文件

  > ```css
  > <style scoped>
  > @import url('../assets/root.css');
  > 
  > /* 已完成的項目 */
  > .completed {
  >     text-decoration: line-through;
  >     color: #aaa;
  >     position: relative;
  >     cursor: pointer;
  > }
  > 
  > .completed::after {
  >     content: '';
  >     position: absolute;
  >     bottom: 0;
  >     left: 0;
  >     width: 100%;
  >     height: 2px;
  >     background-color: #aaa;
  >     transform: scaleX(0);
  >     transform-origin: bottom right;
  >     transition: transform 0.3s ease-in-out;
  > }
  > 
  > .completed:hover::after {
  >     transform: scaleX(1);
  >     transform-origin: bottom left;
  > }
  > 
  > .detail-container-left {
  >     flex: 1;
  >     display: flex;
  >     flex-direction: column;
  >     align-items: flex-start;
  >     gap: 20px;
  > }
  > 
  > /* 右侧容器样式 */
  > .detail-container-right {
  >     flex: 2;
  >     display: flex;
  >     flex-direction: column;
  >     gap: 20px;
  >     height: 100%; /* 设置高度为100% */
  >     overflow: hidden; /* 防止容器本身出现滚动条 */
  > }
  > 
  > .controls {
  >     display: flex;
  >     align-items: center;
  >     gap: 15px; /* 控制按鈕和輸入框之間的間距 */
  > }
  > 
  > .sortLabel {
  >     width: 20%;
  >     padding: 10px;
  >     font-size: 0.95em;
  >     border: 2px solid #ddd;
  >     border-radius: 8px;
  >     transition: border-color 0.3s ease;
  > }
  > /* 修改 detail-content 的樣式 */
  > .detail-content {
  >     display: flex;
  >     align-items: center;
  >     gap: 20px;  /* 增加元素之間的間距 */
  >     width: 100%;
  > }
  > 
  > /* 修改 span 元素的樣式 */
  > .detail-content span {
  >     flex: 1;
  >     margin-right: 30px;  /* 文字和按鈕之間增加間距 */
  > }
  > 
  > /* 修改按鈕容器的樣式 */
  > .button-group {
  >     display: flex;
  >     gap: 15px;  /* 按鈕之間的間距 */
  >     flex-shrink: 0;  /* 防止按鈕被擠壓 */
  > }
  > 
  > /* 詳情列表容器 */
  > .detailList {
  >     list-style: none;
  >     padding: 0;
  >     margin: 0;
  >     overflow-y: auto;
  >     overflow-x: hidden; 
  >     flex: 1;
  > }
  > 
  > .detailList::-webkit-scrollbar {
  >     width: 8px;
  > }
  > 
  > .detailList::-webkit-scrollbar-track {
  >     background: #f1f1f1;
  >     border-radius: 4px;
  > }
  > 
  > .detailList::-webkit-scrollbar-thumb {
  >     background: #888;
  >     border-radius: 4px;
  > }
  > 
  > .detailList::-webkit-scrollbar-thumb:hover {
  >     background: #555;
  > }
  > 
  > /* 詳情項目 */
  > .detailList li {
  >     background: white;
  >     border-radius: 12px;
  >     padding: 16px 20px;
  >     margin-bottom: 15px;
  >     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  >     transition: all 0.3s ease;
  >     border: 1px solid #eee;
  >     display: flex;
  >     flex-direction: column;
  >     gap: 12px;
  > }
  > 
  > .detailList li:hover {
  >     transform: translateX(5px);
  >     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  > }
  > 
  > /* 詳情內容區域 */
  > .detail-content {
  >     display: flex;
  >     align-items: center;
  >     gap: 15px;
  >     padding-bottom: 12px;
  >     border-bottom: 1px solid #eee;
  > }
  > 
  > .menu-span {
  >     font-size: 0.9em;
  >     color: #666;
  >     min-width: 80px; /* 确保标签宽度一致 */
  > }
  > 
  > /* 詳情控制項區域 */
  > .detail-controls {
  >     display: flex;
  >     align-items: center;
  >     gap: 20px;
  >     padding-top: 8px;
  > }
  > 
  > /* 控制項懸停效果 */
  > .detail-controls select:hover,
  > .detail-controls input[type="date"]:hover {
  >     border-color: #40a9ff;
  > }
  > 
  > /*添加一些過渡效果 */
  > .detail-controls select,
  > .detail-controls input[type="date"] {
  >     transition: all 0.3s ease;
  > }
  > /* 優先級選擇器 */
  > select {
  >     padding: 8px 12px;
  >     border: 1px solid #ddd;
  >     border-radius: 6px;
  >     font-size: 0.9em;
  >     min-width: 100px;
  >     background-color: white;
  >     transition: all 0.3s ease;
  > }
  > 
  > /* 日期選擇器 */
  > input[type="date"] {
  >     padding: 8px 12px;
  >     border: 1px solid #ddd;
  >     border-radius: 6px;
  >     font-size: 0.9em;
  >     color: #666;
  >     background-color: white;
  >     min-width: 130px; /* 统一日期选择器宽度 */
  > }
  > 
  > /* 時間信息區域 */
  > .detail-time {
  >     display: flex;
  >     flex-direction: column;
  >     gap: 4px;
  >     margin-left: auto; /* 将时间讯息推到右侧 */
  >     min-width: 200px; /* 确保时间讯息有足够的空间 */
  > }
  > 
  > .detail-time small {
  >     color: #888;
  >     font-size: 0.85em;
  > }
  > 
  > /* 控制區域樣式 */
  > .controls {
  >     background: white;
  >     padding: 15px;
  >     border-radius: 12px;
  >     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  >     margin-bottom: 20px;
  > }
  > 
  > /* 新增詳情區域 */
  > .add-details {
  >     background: white;
  >     padding: 15px;
  >     border-radius: 12px;
  >     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  >     margin-bottom: 20px;
  >     display: flex;
  >     gap: 15px;
  > }
  > </style>
  > ```

### 5.3 tododetails.vue—script中函式的實現 

- **在前面的骨架中，有很多的函式需要實現，現在把它們列下下面。**

  1. saveToLocalStorge：保存數據

  2. addDetail：新增詳情

  3. filteredAndSortedDetails：搜索和排序後的詳情列表  用了計算屬性

  4. startEdit：鎖定編輯的詳情 id 和 文本內容

  5. saveEdit：修改詳情

  6. deleteDetail：刪除詳情

  7. updatePriority：更新優先級

  8. updateDueTime：更新截止日期
  9. toggleCompleted：事項標記完成
  10. getPriorityColor：獲取優先級顏色

- **使用的常量以及onMounted聲明鉤子實現**

  > ```javascript
  > const router = useRouter()
  > const route = useRoute()
  > const todoItemText = ref('')  // 使用 ref 來確保響應性
  > const todoId = ref('')
  > 
  > onMounted(() => {
  >     // 在組件掛載時獲取路由參數
  >     todoItemText.value = route.params.text
  >     todoId.value = route.params.id 
  >     const getStoredData = localStorage.getItem(`todo_detail_${ todoId.value }`)
  >     if (getStoredData) {
  >         details.value = JSON.parse(getStoredData)
  >     }
  >     console.log('路由參數：', route.params) // 用於調試
  > })
  > 
  > // 詳情數據
  > const details = ref([])
  > const newDetailData = ref('')
  > const searchQuery = ref('')
  > const sortBy = ref('createTime')  // 排序方式
  > const sortOrder = ref('desc')    // 排序順序
  > 
  > // 優先級
  > const priorities = [
  >     { value: 'high', label: '高', color: '#ff4d4f' },
  >     { value: 'medium', label: '中', color: '#faad14' },
  >     { value: 'low', label: '低', color: '#52c41a'},
  > ]
  > ```
  >
  > **`router`傳遞參數，`route`接收參數**
  >
  > **想像成寄送包裹：**
  >
  > - `router` 是寄件人（負責發送）
  > - `route` 是收件人（負責接收）

#### 5.3.1 saveToLocalStorge 函式實現

**主要功能：**保存數據

> ```javascript
> const saveToLocalStorage = () => { 
>     localStorage.setItem(`to_do_list_${ todoId.value }`, JSON.stringify(details.value))
> }
> ```
>

#### 5.3.2 addDetail 函式實現

**主要功能：**新增詳情

> ```javascript
> const addDetail = () => {
>     if (newDetailData.value.trim()) {
>         // 使用 ISO 標準返回 Date 對象的字符串格式
>         const now = new Date().toISOString()
>         details.value.push({
>             id: Date.now(),
>             text: newDetailData.value,
>             completed: false,
>             priority: 'medium',
>             dueDate: '',
>             createTime: now,
>             updateTime: now,
>         })
>     } else if (newDetailData.value.trim() === '') {
>         alert('詳情不能為空哦~')
>     }
>     newDetailData.value = ''
>     saveToLocalStorage()
> }
> ```
>

#### 5.3.3 filteredAndSortedDetails 函式實現

**主要功能：**搜索和排序後的詳情列表  用了計算屬性

> ```javascript
> const filteredAndSortedDetails = computed(() => {
>     let result = [...details.value]
>     // 搜索過濾
>     if (searchQuery.value) {
>         result = result.filter(details => 
>             details.text.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
>         )
>     }
>     // 排序
>     result.sort((a, b) => {
>         let compareA = a[sortBy.value]
>         let compareB = b[sortBy.value]
> 
>         // 處理日期類型的比較
>         if (sortBy.value === 'createTime' || sortBy.value === 'updateTime') {
>             compareA = new Date(compareA).getTime()
>             compareB = new Date(compareB).getTime()
>         }
>         // 處理優先級比較
>         else if (sortBy.value === 'priority') {
>             const priorityOrder = { high: 3, medium: 2, low: 1 }
>             compareA = priorityOrder[compareA]
>             compareB = priorityOrder[compareB]
>         }
>         // 處理截止日期的比較
>         else if (sortBy.value === 'dueDate') {
>             compareA = compareA ? new Date(compareA).getTime() : 0
>             compareB = compareB ? new Date(compareB).getTime() : 0
>         }
> 
>         // 根據排序順序返回結果
>         if (sortOrder.value === 'desc') {
>             return compareB - compareA
>         } else {
>             return compareA - compareB
>         }
>     })
>     return result
> })
> ```
>

#### 5.3.4 startEdit 函式實現

**主要功能：**鎖定編輯的詳情 id 和 文本內容

> ```javascript
> const startEdit = (details) => {
>     editingIndex.value = details.id
>     editText.value = details.text
> }
> 
> ```
>

#### 5.3.5 saveEdit 函式實現

**主要功能：**修改詳情

> ```javascript
> const saveEdit = (details) => {
>     if (editText.value.trim()) {
>         details.text = editText.value
>         details.updateTime = new Date().toISOString()
>         editingIndex.value = -1
>         saveToLocalStorage()
>     }
> }
> ```
>

#### 5.3.6 deleteDetail 函式實現

**主要功能：**刪除詳情 

> ```javascript
> const deleteDetail = (id) => {
>     const index = details.value.findIndex(item => item.id === id)
>     if (index > -1) {
>         details.value.splice(index, 1)
>         saveToLocalStorage()
>     }
> }
> ```
>

#### 5.3.7 updatePriority 函式實現

**主要功能：**更新優先級

> ```javascript
> const updatePriority = (details, priority) => { 
>     details.priority = priority
>     details.updateTime = new Date().toISOString()
>     saveToLocalStorage()
> }
> ```
>

#### 5.3.8 updateDueTime 函式實現

**主要功能：**更新截止日期

> ```javascript
> const updateDueTime = (details, dueDateTime) => {
>     details.dueDate = dueDateTime
>     details.updateTime = new Date().toISOString()
>     saveToLocalStorage()
> }
> ```
>

#### 5.3.9 toggleCompleted 函式實現

**主要功能：**事項標記完成

> ```javascript
> const toggleCompleted = (item) => {
>     item.completed = !item.completed
>     saveToLocalStorage()
> }
> ```
>

#### 5.3.10 getPriorityColor 函式實現

**主要功能：**獲取優先級顏色 

> ```javascript
> const getPriorityColor = (priorityValue) => {
>     const priority = priorities.find(p => p.value === priorityValue)
>     return priority ? priority.color : '#000000'
> }
> ```

#### 5.4 一些方法的講解

##### 5.4.1 計算屬性 (Computed Properties)

計算屬性是 Vue 中的一個重要特性，用於處理複雜的數據計算。

> ```javascript
> // 基本語法
> const result = computed(() => {
>     // 計算邏輯
>     return // 計算結果
> })
> 
> // 實際例子
> const firstName = ref('John')
> const lastName = ref('Doe')
> 
> const fullName = computed(() => {
>     return `${firstName.value} ${lastName.value}`
> })
> ```

**特點：**

- 具有緩存機制，只有當依賴項改變時才重新計算
- 可以像普通屬性一樣使用
- 適合處理需要根據其他數據計算得出的值
- 比 methods 更高效（因為緩存）

```javascript
// 帶 getter 和 setter 的計算屬性
const fullName = computed({
    get() {
        return `${firstName.value} ${lastName.value}`
    },
    set(newValue) {
        [firstName.value, lastName.value] = newValue.split(' ')
    }
})
```

##### 5.4.2 filter 方法

`filter` 用於創建一個新數組，包含所有通過測試的元素。

> ```javascript
> // 基本語法
> array.filter(callback(element[, index[, array]]))
> 
> // 簡單例子
> const numbers = [1, 2, 3, 4, 5]
> const evenNumbers = numbers.filter(num => num % 2 === 0)
> // 結果: [2, 4]
> 
> // 複雜例子
> const users = [
>     { name: 'John', age: 25 },
>     { name: 'Jane', age: 17 },
>     { name: 'Bob', age: 30 }
> ]
> 
> // 篩選成年用戶
> const adults = users.filter(user => user.age >= 18)
> // 結果: [{ name: 'John', age: 25 }, { name: 'Bob', age: 30 }]
> 
> // 結合多個條件
> const filteredUsers = users.filter(user => {
>     return user.age >= 18 && user.name.startsWith('J')
> })
> ```

##### 5.4.3 sort 方法

`sort` 用於對數組元素進行排序。

> ```javascript
> // 基本語法
> array.sort([compareFunction])
> 
> // 基本用法（字母順序）
> const fruits = ['banana', 'apple', 'orange']
> fruits.sort()  // ['apple', 'banana', 'orange']
> 
> // 數字排序（需要比較函數）
> const numbers = [23, 5, 100, 56, 9, 1, 2]
> numbers.sort((a, b) => a - b)  // 升序
> numbers.sort((a, b) => b - a)  // 降序
> 
> // 對象數組排序
> const users = [
>     { name: 'John', age: 30 },
>     { name: 'Alice', age: 25 },
>     { name: 'Bob', age: 35 }
> ]
> 
> // 按年齡排序
> users.sort((a, b) => a.age - b.age)
> 
> // 按名字排序
> users.sort((a, b) => a.name.localeCompare(b.name))
> 
> // 複雜排序邏輯
> const items = [
>     { name: 'Item A', priority: 'high', date: '2023-01-01' },
>     { name: 'Item B', priority: 'low', date: '2023-02-01' },
>     { name: 'Item C', priority: 'medium', date: '2023-03-01' }
> ]
> 
> items.sort((a, b) => {
>     const priorityMap = { high: 3, medium: 2, low: 1 }
>     // 先按優先級排序
>     const priorityDiff = priorityMap[b.priority] - priorityMap[a.priority]
>     if (priorityDiff !== 0) return priorityDiff
>     // 如果優先級相同，按日期排序
>     return new Date(b.date) - new Date(a.date)
> })
> ```

##### 5.4.4 find 方法

`find` 返回數組中滿足條件的第一個元素。

> ```javascript
> // 基本語法
> array.find(callback(element[, index[, array]]))
> 
> // 示例 1：查找第一個偶數
> const numbers = [1, 3, 4, 5, 6]
> const firstEven = numbers.find(num => num % 2 === 0)
> console.log(firstEven) // 4
> 
> // 示例 2：查找特定 ID 的待辦事項
> const todos = [
>     { id: 1, text: '學習' },
>     { id: 2, text: '運動' },
>     { id: 3, text: '購物' }
> ]
> const todo = todos.find(todo => todo.id === 2)
> console.log(todo) // { id: 2, text: '運動' }
> ```

##### 5.4.5 includes 方法

`includes()` 方法用於判斷數組或字符串是否包含特定元素。

> ```javascript
> // 字符串使用
> const str = 'Hello World'
> console.log(str.includes('World'))  // true
> console.log(str.includes('world'))  // false（區分大小寫）
> 
> // 數組使用
> const arr = [1, 2, 3, 4, 5]
> console.log(arr.includes(3))  // true
> console.log(arr.includes(6))  // false
> 
> // 帶起始索引的搜索
> console.log(str.includes('o', 5))  // true
> console.log(arr.includes(2, 2))    // false
> 
> // 實際應用
> const searchText = 'apple'
> const items = ['apple pie', 'banana', 'apple juice']
> const filteredItems = items.filter(item => 
>     item.toLowerCase().includes(searchText.toLowerCase())
> )
> ```

##### 5.4.6 toISOString()

`toISOString()` 將 Date 對象轉換為 ISO 格式的字符串。

> ```javascript
> // 基本語法
> date.toISOString()
> 
> // 示例 1：基本使用
> const date = new Date()
> console.log(date.toISOString())
> // 輸出類似：'2024-03-15T08:30:00.000Z'
> 
> // 示例 2：實際應用
> const todo = {
>     text: '新任務',
>     createdAt: new Date().toISOString()
> }
> console.log(todo)
> // 輸出：{ text: '新任務', createdAt: '2024-03-15T08:30:00.000Z' }
> 
> // 示例 3：日期處理
> const formatDate = (dateString) => {
>     const date = new Date(dateString)
>     return date.toISOString().split('T')[0]  // 只取日期部分
> }
> console.log(formatDate(new Date()))  // '2024-03-15'
> ```

##### 綜合應用示例

> ```javascript
> // 定義待辦事項的數據結構和管理方法
> const todoManager = {
>     todos: [
>         { 
>             id: 1, 
>             text: '學習', 
>             done: false, 
>             priority: 'high',
>             createdAt: '2024-03-01T10:00:00.000Z',
>             category: 'study'
>         },
>         { 
>             id: 2, 
>             text: '運動', 
>             done: true, 
>             priority: 'medium',
>             createdAt: '2024-03-02T09:00:00.000Z',
>             category: 'health'  
>         },
>         { 
>             id: 3, 
>             text: '購物', 
>             done: false, 
>             priority: 'low',
>             createdAt: '2024-03-03T14:00:00.000Z',
>             category: 'life'
>         }
>     ],
> 
>     // 1. 過濾功能
>     filterTodos(filters) {
>         return this.todos.filter(todo => {
>             // 多條件過濾
>             const matchStatus = filters.status ? 
>                 (filters.status === 'done' ? todo.done : !todo.done) : true
>             const matchCategory = filters.category ? 
>                 todo.category === filters.category : true
>             const matchText = filters.searchText ? 
>                 todo.text.toLowerCase().includes(filters.searchText.toLowerCase()) : true
>             
>             return matchStatus && matchCategory && matchText
>         })
>     },
> 
>     // 2. 排序功能 
>     sortTodos(sortBy = 'createdAt', order = 'asc') {
>         return [...this.todos].sort((a, b) => {
>             const priorityMap = { high: 3, medium: 2, low: 1 }
>             
>             switch(sortBy) {
>                 case 'priority':
>                     const diff = priorityMap[b.priority] - priorityMap[a.priority]
>                     return order === 'asc' ? -diff : diff
>                     
>                 case 'createdAt':
>                     const timeA = new Date(a.createdAt)
>                     const timeB = new Date(b.createdAt)
>                     return order === 'asc' ? 
>                         timeA - timeB : 
>                         timeB - timeA
>                         
>                 default:
>                     return 0
>             }
>         })
>     },
> 
>     // 3. 查找功能 
>     findTodo(criteria) {
>         if (typeof criteria === 'number') {
>             // 按 ID 查找
>             return this.todos.find(todo => todo.id === criteria)
>         } else if (typeof criteria === 'string') {
>             // 按文本模糊查找
>             return this.todos.find(todo => 
>                 todo.text.toLowerCase().includes(criteria.toLowerCase())
>             )
>         }
>         return null
>     },
> 
>     // 4. 添加功能
>     addTodo(todoData) {
>         const newTodo = {
>             id: Date.now(), // 使用時間戳作為唯一ID
>             text: todoData.text,
>             done: false,
>             priority: todoData.priority || 'medium',
>             category: todoData.category || 'general',
>             createdAt: new Date().toISOString()
>         }
>         this.todos.push(newTodo)
>         return newTodo
>     },
> 
>     // 5. 更新功能
>     updateTodo(id, updates) {
>         const todo = this.findTodo(id)
>         if (todo) {
>             Object.assign(todo, {
>                 ...updates,
>                 updatedAt: new Date().toISOString()
>             })
>             return true
>         }
>         return false
>     }
> }
> 
> // 使用示例
> console.log('===== 過濾示例 =====')
> // 查找未完成的學習類任務
> console.log(todoManager.filterTodos({ 
>     status: 'pending', 
>     category: 'study' 
> }))
> 
> console.log('===== 排序示例 =====')
> // 按優先級降序排序
> console.log(todoManager.sortTodos('priority', 'desc'))
> 
> console.log('===== 查找示例 =====')
> // 按ID查找
> console.log(todoManager.findTodo(1))
> // 按文本查找
> console.log(todoManager.findTodo('運動'))
> 
> console.log('===== 添加示例 =====')
> // 添加新任務
> const newTodo = todoManager.addTodo({
>     text: '寫代碼',
>     priority: 'high',
>     category: 'work'
> })
> console.log(newTodo)
> 
> console.log('===== 更新示例 =====')
> // 更新任務
> console.log(todoManager.updateTodo(1, { 
>     done: true,
>     priority: 'low'
> }))
> ```

這些方法的特點：

- `filter`: 不修改原數組，返回新數組
- `sort`: 直接修改原數組
- `find`: 返回單個元素或 undefined
- `toISOString()`: 生成標準格式的時間字符串

### 6. 完整的 tododetails.vue 程式碼

> ```vue
> <script setup>
> import { ref, onMounted, computed } from 'vue'
> import Button from './BaseButton.vue'
> import { useRouter, useRoute } from 'vue-router';
> import InputBar from './InputBar.vue';
> 
> const router = useRouter()
> const route = useRoute()
> const todoItemText = ref('')  // 使用 ref 來確保響應性
> const todoId = ref('')
> 
> onMounted(() => {
>        // 在組件掛載時獲取路由參數
>        todoItemText.value = route.params.text
>        todoId.value = route.params.id 
>        const getStoredData = localStorage.getItem(`todo_detail_${ todoId.value }`)
>        if (getStoredData) {
>            details.value = JSON.parse(getStoredData)
>        }
>        console.log('路由參數：', route.params) // 用於調試
> })
> 
> // 詳情數據
> const details = ref([])
> const newDetailData = ref('')
> const searchQuery = ref('')
> const sortBy = ref('createTime')  // 排序方式
> const sortOrder = ref('desc')    // 排序順序
> 
> // 優先級
> const priorities = [
>        { value: 'high', label: '高', color: '#ff4d4f' },
>        { value: 'medium', label: '中', color: '#faad14' },
>        { value: 'low', label: '低', color: '#52c41a'},
> ]
> 
> // 新增詳情
> const addDetail = () => {
>        if (newDetailData.value.trim()) {
>            // 使用 ISO 標準返回 Date 對象的字符串格式
>            const now = new Date().toISOString()
>            details.value.push({
>                id: Date.now(),
>                text: newDetailData.value,
>                completed: false,
>                priority: 'medium',
>                dueDate: '',
>                createTime: now,
>                updateTime: now
>            })
>        } else if (newDetailData.value.trim() === '') {
>            alert('詳情不能為空哦~')
>        }
>        newDetailData.value  = ''
>        saveToLocalStorage()
> }
> 
> // 搜索和排序後的詳情列表
> const filteredAndSortedDetails = computed(() => {
>     let result = [...details.value]
>        // 搜索過濾
>        if (searchQuery.value) {
>            result = result.filter(details => 
>                details.text.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
>            )
>        }
>        // 排序
>        result.sort((a, b) => {
>            let compareA = a[sortBy.value]
>            let compareB = b[sortBy.value]
>    
>         // 處理日期類型的比較
>            if (sortBy.value === 'createTime' || sortBy.value === 'updateTime') {
>                compareA = new Date(compareA).getTime()
>                compareB = new Date(compareB).getTime()
>            }
>            // 處理優先級比較
>            else if (sortBy.value === 'priority') {
>                const priorityOrder = { high: 3, medium: 2, low: 1 }
>                compareA = priorityOrder[compareA]
>                compareB = priorityOrder[compareB]
>            }
>            // 處理截止日期的比較
>            else if (sortBy.value === 'dueDate') {
>                compareA = compareA ? new Date(compareA).getTime() : 0
>                compareB = compareB ? new Date(compareB).getTime() : 0
>            }
>    
>         // 根據排序順序返回結果
>            if (sortOrder.value === 'desc') {
>                return compareB - compareA
>            } else {
>                return compareA - compareB
>            }
>        })
>        return result
>    })
> 
> 
> // 編輯詳情
> const editingIndex = ref('-1')
> const editText = ref('')
> 
> const startEdit = (details) => {
>     editingIndex.value = details.id
>        editText.value = details.text
>    }
> 
> // 修改詳情
> const saveEdit = (details) => {
>     if (editText.value.trim()) {
>            details.text = editText.value
>            details.updateTime = new Date().toISOString()
>            editingIndex.value = -1
>            saveToLocalStorage()
>        }
>    }
> 
> // 刪除詳情
> const deleteDetail = (id) => {
>     const index = details.value.findIndex(item => item.id === id)
>        if (index > -1) {
>            details.value.splice(index, 1)
>            saveToLocalStorage()
>        }
>    }
> 
> // 更新優先級
> const updatePriority = (details, priority) => { 
>     details.priority = priority
>        details.updateTime = new Date().toISOString()
>        saveToLocalStorage()
>    }
> 
> //更新截止日期
> const updateDueTime = (details, dueDateTime) => {
>     details.dueDate = dueDateTime
>        details.updateTime = new Date().toISOString()
>        saveToLocalStorage()
>    }
> 
> // 保存數據
> const saveToLocalStorage = () => {
>     localStorage.setItem(`todo_detail_${ todoId.value }`, JSON.stringify(details.value))
>    }
> 
> const toggleCompleted = (item) => {
>     item.completed = !item.completed
>        saveToLocalStorage()
>    }
> 
> const getPriorityColor = (priorityValue) => {
>     const priority = priorities.find(p => p.value === priorityValue)
>        return priority ? priority.color : '#000000'
>    }
> 
> </script>
> 
> <template>
>     <div class="root">
>            <div class="detail-container-left">
>                <h1 class="title">{{ todoItemText }}</h1>
>                <Button 
>                    @click="router.push('/')"
>                    text="返回" 
>                    type="normal" />
>            </div>
>    
>         <div class="detail-container-right">
>                <!-- 搜索和排序區域 -->
>                <div class="controls">
>                    <InputBar 
>                        type="inputTextChange"
>                        hint="搜索詳情..."
>                        v-model="searchQuery"/>
>                    <select class="sortLabel" v-model="sortBy">
>                        <option value="createTime">創建時間</option>
>                        <option value="updateTime">更新時間</option>
>                        <option value="priority">優先級</option>
>                        <option value="dueDate">截止日期</option>
>                    </select>
>                    <Button 
>                        type="sort" 
>                        :text="sortOrder === 'desc' ? '降序' : '升序'" 
>                        @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'" />
>                </div>
>    
>             <!-- 新增詳情 -->
>                <div class="add-details">
>                    <InputBar
>                        v-model="newDetailData"
>                        type="inputTextChange"
>                        hint="新增詳情..."
>                        :style="{ marginRight: '15px' }"
>                        @keyup.enter="addDetail()"/>
>                    <Button
>                        type="add"
>                        @click="addDetail()"
>                        text="新增詳情"/>
>                </div>
>                <!-- 詳情列表 -->
>                <ul class="detailList">
>                    <li v-for="item of filteredAndSortedDetails" 
>                        :key="item.id">
>                        <!-- 詳情內容 -->
>                        <div class="detail-content">
>                            <template v-if="editingIndex === item.id">
>                                <InputBar
>                                        v-model="editText" 
>                                        type="inputTextChange"
>                                        @keyup.enter="saveEdit(item)"
>                                        @blur="saveEdit(item)"/>
>                            </template>
>                            <template v-else>
>                                <span 
>                                    :class="{ completed: item.completed }"
>                                    @click="toggleCompleted(item)" >{{ item.text }}</span>
>                                    <Button
>                                            text="修改詳情"
>                                            type="smallUpdate"
>                                            @click="startEdit(item)"/>
>                                    <Button
>                                            text="刪除詳情"
>                                            type="smallRemove"
>                                            @click="deleteDetail(item.id)"/>
>                            </template>
>                        </div>
>                        <!-- 詳情控制項 -->
>                        <div class="detail-controls">
>                            <!-- 優先級選擇 -->
>                            <span class="menu-span">优先级选择：</span>
>                            <select
>                                    v-model="item.priority"
>                                    @change="updatePriority(item, $event.target.value)"
>                                    :style="{ color: getPriorityColor(item.priority) }">
>                                <option v-for="priority in priorities"
>                                        :key="priority.value"
>                                        :value="priority.value"
>                                        :style="{ color: priority.color }">
>                                    {{ priority.label }}
>                                </option>
>                            </select>
>                            <!-- 截止日期 -->
>                            <span class="menu-span">截止日期：</span>
>                            <input 
>                                type="date"
>                                :value="item.dueDate"
>                                @change="updateDueTime(item, $event.target.value)">
>                            <!-- 時間更新 -->
>                            <div class="detail-time">
>                                <small>創建：{{ new Date(item.createTime).toLocaleString() }}</small>
>                                <small>更新：{{ new Date(item.updateTime).toLocaleString() }}</small>
>                            </div>
>                        </div>
>                    </li>
>                </ul>
>            </div>
>        </div>
>    </template>
> 
> <style scoped>
> @import url('../assets/root.css');
> 
> /* 已完成的項目 */
> .completed {
>     text-decoration: line-through;
>        color: #aaa;
>        position: relative;
>        cursor: pointer;
>    }
> 
> .completed::after {
>     content: '';
>        position: absolute;
>        bottom: 0;
>        left: 0;
>        width: 100%;
>        height: 2px;
>        background-color: #aaa;
>        transform: scaleX(0);
>        transform-origin: bottom right;
>        transition: transform 0.3s ease-in-out;
>    }
> 
> .completed:hover::after {
>     transform: scaleX(1);
>        transform-origin: bottom left;
>    }
> 
> .detail-container-left {
>     flex: 1;
>        display: flex;
>        flex-direction: column;
>        align-items: flex-start;
>        gap: 20px;
>    }
> 
> /* 右侧容器样式 */
> .detail-container-right {
>     flex: 2;
>        display: flex;
>        flex-direction: column;
>        gap: 20px;
>        height: 100%; /* 设置高度为100% */
>        overflow: hidden; /* 防止容器本身出现滚动条 */
>    }
> 
> .controls {
>     display: flex;
>        align-items: center;
>        gap: 15px; /* 控制按鈕和輸入框之間的間距 */
>    }
> 
> .sortLabel {
>     width: 20%;
>        padding: 10px;
>        font-size: 0.95em;
>        border: 2px solid #ddd;
>        border-radius: 8px;
>        transition: border-color 0.3s ease;
>    }
> /* 修改 detail-content 的樣式 */
> .detail-content {
>     display: flex;
>        align-items: center;
>        gap: 20px;  /* 增加元素之間的間距 */
>        width: 100%;
>    }
> 
> /* 修改 span 元素的樣式 */
> .detail-content span {
>     flex: 1;
>        margin-right: 30px;  /* 文字和按鈕之間增加間距 */
>    }
> 
> /* 修改按鈕容器的樣式 */
> .button-group {
>     display: flex;
>        gap: 15px;  /* 按鈕之間的間距 */
>        flex-shrink: 0;  /* 防止按鈕被擠壓 */
>    }
> 
> /* 詳情列表容器 */
> .detailList {
>     list-style: none;
>        padding: 0;
>        margin: 0;
>        overflow-y: auto;
>        overflow-x: hidden; 
>        flex: 1;
>    }
> 
> .detailList::-webkit-scrollbar {
>     width: 8px;
>    }
> 
> .detailList::-webkit-scrollbar-track {
>     background: #f1f1f1;
>        border-radius: 4px;
>    }
> 
> .detailList::-webkit-scrollbar-thumb {
>     background: #888;
>        border-radius: 4px;
>    }
> 
> .detailList::-webkit-scrollbar-thumb:hover {
>     background: #555;
>    }
> 
> /* 詳情項目 */
> .detailList li {
>     background: white;
>        border-radius: 12px;
>        padding: 16px 20px;
>        margin-bottom: 15px;
>        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
>        transition: all 0.3s ease;
>        border: 1px solid #eee;
>        display: flex;
>        flex-direction: column;
>        gap: 12px;
>    }
> 
> .detailList li:hover {
>     transform: translateX(5px);
>        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
>    }
> 
> /* 詳情內容區域 */
> .detail-content {
>     display: flex;
>        align-items: center;
>        gap: 15px;
>        padding-bottom: 12px;
>        border-bottom: 1px solid #eee;
>    }
> 
> .menu-span {
>     font-size: 0.9em;
>        color: #666;
>        min-width: 80px; /* 确保标签宽度一致 */
>    }
> 
> /* 詳情控制項區域 */
> .detail-controls {
>     display: flex;
>        align-items: center;
>        gap: 20px;
>        padding-top: 8px;
>    }
> 
> /* 控制項懸停效果 */
> .detail-controls select:hover,
> .detail-controls input[type="date"]:hover {
>     border-color: #40a9ff;
>    }
> 
> /*添加一些過渡效果 */
> .detail-controls select,
> .detail-controls input[type="date"] {
>     transition: all 0.3s ease;
>    }
> /* 優先級選擇器 */
> select {
>     padding: 8px 12px;
>        border: 1px solid #ddd;
>        border-radius: 6px;
>        font-size: 0.9em;
>        min-width: 100px;
>        background-color: white;
>        transition: all 0.3s ease;
>    }
> 
> /* 日期選擇器 */
> input[type="date"] {
>     padding: 8px 12px;
>        border: 1px solid #ddd;
>        border-radius: 6px;
>        font-size: 0.9em;
>        color: #666;
>        background-color: white;
>        min-width: 130px; /* 统一日期选择器宽度 */
>    }
> 
> /* 時間信息區域 */
> .detail-time {
>     display: flex;
>        flex-direction: column;
>        gap: 4px;
>        margin-left: auto; /* 将时间讯息推到右侧 */
>        min-width: 200px; /* 确保时间讯息有足够的空间 */
>    }
> 
> .detail-time small {
>     color: #888;
>        font-size: 0.85em;
>    }
> 
> /* 控制區域樣式 */
> .controls {
>     background: white;
>        padding: 15px;
>        border-radius: 12px;
>        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
>        margin-bottom: 20px;
>    }
> 
> /* 新增詳情區域 */
> .add-details {
>     background: white;
>        padding: 15px;
>        border-radius: 12px;
>        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
>        margin-bottom: 20px;
>        display: flex;
>        gap: 15px;
>    }
> </style>
> ```

![](D:\WorkBox\LearnCoding\Vue3ProjectExerciseMarkdownNote\to-do-list\pics\to-do-list-pic03.png)

