## .课程学习

/study/learn

### 获取进度列表（含模块

https://mooc.icve.com.cn/study/learn/getProcessList

#### 请求体

| 参数         | 内容   | 备注 |
| ------------ | ------ | ---- |
| courseOpenId | 课程id |      |

#### 响应体

##### 根对象

| 参数       | 类型    | 内容     | 备注           |
| ---------- | ------- | -------- | -------------- |
| code       | Number  | 状态码   | 1，正常        |
| isViewOver | Boolean |          |                |
| lockStatus | Number  | 锁状态   | 0，未锁；1，锁 |
| proces     | Object  | 进度列表 |                |

##### proces 对象

| 参数       | 类型           | 内容                   | 备注 |
| ---------- | -------------- | ---------------------- | ---- |
| moduleList | Array (Object) | 模块列表               |      |
| topicList  | Object         | 当前进度打开的话题列表 |      |

##### moduleList 中的元素

| 参数       | 类型    | 内容     | 备注     |
| ---------- | ------- | -------- | -------- |
| ModuleType | Number  | 模块类型 |          |
| ResId      | String  | 资源id   |          |
| id         | String  | 模块id   | moduleId |
| isUnlock   | Boolean | 解锁状态 |          |
| name       | String  | 模块名称 |          |
| percent    | Number  | 完成进度 |          |
| sortOrder  | Number  | 排序序数 |          |

##### topicList 对象

### 通过模块id获取话题

https://mooc.icve.com.cn/study/learn/getTopicByModuleId

#### 请求体

| 参数         | 内容   | 备注 |
| ------------ | ------ | ---- |
| courseOpenId | 课程id |      |
| moduleId     | 模块id |      |

#### 响应体

##### 根对象

| 参数      | 类型           | 内容     | 备注                     |
| --------- | -------------- | -------- | ------------------------ |
| code      | Number         | 状态码   |                          |
| moduleId  | String         | 模块id   |                          |
| topicId   | String         | 话题id   | 如果没传他，似乎不会返回 |
| topicList | Array (Object) | 话题列表 |                          |

##### topicList 中的元素

| 参数        | 类型    | 内容                 | 备注                               |
| ----------- | ------- | -------------------- | ---------------------------------- |
| id          | String  | 话题id               |                                    |
| isLastStudy | Boolean | 是否位最后一次学习的 |                                    |
| name        | String  | 话题名称             |                                    |
| sortOrder   | Number  | 排序序号             |                                    |
| studyStatus | Number  | 学习状态             | -1，未学习；0，部分学习；1，已学习 |
| upTopicId   | String  | 上级话题id           |                                    |

### 通过话题id获取cell

https://mooc.icve.com.cn/study/learn/getCellByTopicId

#### 请求体

| 参数         | 内容   | 备注 |
| ------------ | ------ | ---- |
| courseOpenId | 课程id |      |
| topicId      | 话题id |      |

#### 响应体

##### 根对象

| 参数         | 类型           | 内容     | 备注 |
| ------------ | -------------- | -------- | ---- |
| code         | Number         | 状态码   |      |
| cellList     | Array (Object) | cell列表 |      |
| courseOpenId | String         | 课程id   |      |

##### cellList 中的元素

| 参数            | 类型    | 内容           | 备注        |
| --------------- | ------- | -------------- | ----------- |
| Id              | String  | cell id        |             |
| categoryName    | String  | 分类           |             |
| cellContent     | String  | 内容           |             |
| cellName        | String  | 名称           |             |
| cellType        | Number  | 类型           |             |
| childNodeList   | Array   | 子节点列表     |             |
| courseOpenId    | String  | 课程id         |             |
| externalLinkUrl | String  | N / A          |             |
| isAllowDownLoad | Boolean | 是否允许下载   |             |
| isGJS           | Boolean | N / A          |             |
| isStudyFinish   | Boolean | 是否学习过     |             |
| isUnlock        | Boolean | 是否解锁       |             |
| parentId        | String  | 父节点id       | 比如topicId |
| resId           | String  | 资源id         |             |
| resourceUrl     | String  | 资源url        |             |
| sortOrder       | Number  | 排序序号       |             |
| topicId         | String  | 话题id         |             |
| upCellId        | String  | 上一个cell的id |             |

##### cellType 类型表

| cellType | 内容               | 备注 |
| -------- | ------------------ | ---- |
| 5        | 测验               |      |
| 8        | 讨论               |      |
| 1        | 文档、视频、图片等 |      |
| 6        | 作业               |      |

### 更新cell数据 记录时长 (提交用)

https://mooc.icve.com.cn/study/learn/statStuProcessCellLogAndTimeLong

#### 请求体

| 参数               | 必选   | 内容                  | 备注 |
| ------------------ | ------ | --------------------- | ---- |
| courseOpenId       | 是     | 开课id                |      |
| moduleId           | 否     | 模块id                |      |
| cellId             | 是     | cell id               |      |
| auvideoLength      | 仅视频 | 视频时长              |      |
| videoTimeTotalLong | 是     | 视频为时长，非视频为0 |      |
| sourceForm         | 否     | N / A                 |      |

#### 响应体

##### 根对象

| 参数    | 类型    | 内容         | 备注 |
| ------- | ------- | ------------ | ---- |
| code    | Number  | 状态码       |      |
| isStudy | Boolean | 是否学习成功 |      |

### 获取模块滑动列表 (外加视频时长)

https://mooc.icve.com.cn/study/learn/getModulsSliderList

#### 请求体

| 参数         | 必选 | 内容         | 备注  |
| ------------ | ---- | ------------ | ----- |
| courseOpenId | 是   | 开课id       |       |
| cellId       | 是   | cell id      |       |
| cellIdHash   | 否   | cell id hash |       |
| page         | 否   | 页数         |       |
| fromType     | 否   | 来源类型     | 如stu |
| moduleId     | 否   | 模块id       |       |

#### 响应体

##### 根对象

| 参数       | 类型           | 内容         | 备注 |
| ---------- | -------------- | ------------ | ---- |
| code       | Number         | 状态码       |      |
| courseCell | Object         | 课程cell对象 |      |
| isOver     | NUmber         | N / A        |      |
| modules    | Array (Object) | 模块列表     |      |
| userId     | String         | 用户id       |      |

##### courseCell 对象 (对象节点太多 这里只写了常用节点)

| 参数          | 类型   | 内容     | 备注   |
| ------------- | ------ | -------- | ------ |
| CellName      | String | cell名称 |        |
| CategoryName  | String | 分类     |        |
| CellContent   | String | cell内容 | 一般无 |
| CellType      | Number | cell模式 |        |
| Id            | String | cell id  |        |
| CourseOpenId  | String | 开课id   |        |
| VideoTimeLong | Number | 视频长度 |        |



## 课程讨论

/study/discussion

### 浏览讨论

https://mooc.icve.com.cn/study/discussion/addStuViewTopicRemember

#### 请求体

| 参数         | 内容   | 备注 |
| ------------ | ------ | ---- |
| courseOpenId | 开课id |      |
| topicId      | 话题id |      |

#### 响应体

##### 根对象

| 参数 | 类型   | 内容   | 备注 |
| ---- | ------ | ------ | ---- |
| code | Number | 状态码 |      |
| msg  | String | 信息   |      |

## 常规数据

/common

### 获取用户信息

https://mooc.icve.com.cn/common/localStorage/getUserInfo

#### 请求体

| 参数         | 必选 | 内容   | 备注 |
| ------------ | ---- | ------ | ---- |
| courseOpenId | 否   | 课程id |      |
|              |      |        |      |

#### 响应体

##### 不带请求参数时

###### 根对象

| 参数               | 类型          | 内容                            | 备注 |
| ------------------ | ------------- | ------------------------------- | ---- |
| code               | Number        | 状态码                          |      |
| userInfo           | Object        | 用户信息                        |      |
| AvatarUrl          | String        | 头像url                         |      |
| IsUnionManager     | Boolean       | 是否全局管理员                  |      |
| IsTinyMajorManager | Boolean       | 是否课程管理员                  |      |
| logo               | String        | 当前账户对应职教云显示logo的url |      |
| time               | String (Date) | 时间                            |      |
| xlsyUrl            | String        | N / A                           |      |
| file_system_url    | String        | 当前系统使用oss                 |      |
| signature          | Object        | 签名数据                        |      |
| jumpUrl            | String        | 跳转url                         |      |

###### userInfo 对象

| 参数        | 类型    | 内容                   | 备注            |
| ----------- | ------- | ---------------------- | --------------- |
| Id          | String  | user id                |                 |
| UserName    | String  | 用户名                 |                 |
| DisplayName | String  | 显示名                 |                 |
| UserType    | Number  | 用户类型               | 1，学生         |
| IsValid     | Boolean | 是否可用               |                 |
| IsValidIcve | Number  | 是否在职教云可用       |                 |
| IsValidZjy  | Number  | 同上，没弄明白有啥区别 |                 |
| AvatorUrl   | String  | 头像url                | 似乎是给oss用的 |
| SchoolId    | String  | 学校id                 |                 |
| DataSource  | Number  | N / A                  |                 |

## 入口

/portal

### 获取我的课程列表 (推荐)

https://mooc.icve.com.cn/portal/Course/getMyCourse

#### 请求体

| 参数       | 内容       | 备注 |
| ---------- | ---------- | ---- |
| isFinished |            |      |
| page       |            |      |
| pageSize   | 页面内容数 |      |

#### 响应体

##### 根对象

| 参数       | 类型           | 内容     | 备注 |
| ---------- | -------------- | -------- | ---- |
| code       | Number         | 状态码   |      |
| list       | Array (Object) | 课程列表 |      |
| pagination | Object         | 页码相关 |      |

##### list 中的元素

| 参数           | 类型            | 内容         | 备注                      |
| -------------- | --------------- | ------------ | ------------------------- |
| DateCreated    | String (Date)   | 课程创建日期 |                           |
| Id             | String          | 课程id       | 不是courseOpenId          |
| classify       | Number          | N / A        |                           |
| courseName     | String          | 课程名称     |                           |
| courseOpenId   | String          | 开课id       | 本次开课后的id            |
| courseOpenName | String          | 开课名称     |                           |
| courseType     | Number          | 课程类型     |                           |
| coverUrl       | String          | 封面url      |                           |
| process        | Number          | 完成进度     |                           |
| stuCount       | String (Number) | 学生数量     |                           |
| stuId          | String          | 学生id       | 是的，就是你自己的user id |
| thumbnail      | String          | 缩略图url    |                           |

##### pagination 对象

| 参数       | 类型   | 内容         | 备注 |
| ---------- | ------ | ------------ | ---- |
| pageIndex  | Number | 页数索引     |      |
| pageSize   | Number | 单页条目容量 |      |
| totalCount | Number | 总条目数量   |      |

### 获取课程列表

https://mooc.icve.com.cn/portal/course/getCourseOpenList

#### 响应体

##### 根对象

| 参数 | 类型           | 内容     | 备注 |
| ---- | -------------- | -------- | ---- |
| code | Number         | 状态码   |      |
| list | Array (Object) | 课程列表 |      |

##### list 中的元素

| 参数 | 类型   | 内容     | 备注         |
| ---- | ------ | -------- | ------------ |
| id   | String | 课程id   | courseOpenId |
| text | String | 课程名称 |              |

