/*
fkicve
*/

// 引用库
const readline = require('readline');
const fs = require('fs');
const axios = require('axios');
const qs = require('qs');

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 Edg/96.0.1054.53"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 配置文件
const cfg = require('./config.json');
const apiUrl = require('./apiURL.json');

// 初始化控制台输入
process.stdin.setEncoding('utf8');

mainFor();

async function mainFor() {
    while (1) {
        await initialize();
    }
}


// 初始化函数
async function initialize() {

    // 初始化函数内变量
    let userInfo, crouseList;

    // 获取Cookie
    let Cookie = await getCookie();

    // 设置默认请求header
    axios.defaults.headers = {
        Cookie,
        'User-Agent': UA
    };
    axios.defaults.withCredentials = true;

    // 获取用户信息
    userInfo = await getUserInfo();
    if (!userInfo.Id && userInfo.code != 1) {
        return;
    }

    // 获取课程列表
    crouseList = await getMyCourse();
    if (!crouseList || !crouseList.length) {
        return;
    }

    // 获取模块列表
    moduleList = await toGetProcessList(crouseList);
    if (!moduleList) {
        return;
    }

    await toDoIt(moduleList);


}


// 获取Cookie
function getCookie() {
    return new Promise(async (resolve, reject) => {

        console.log("请输入auth: (直接回车使用config.json中的auth)");

        rl.once('line', (input) => {
            if (!input) {
                resolve(cfg.Cookie);
            } else {
                resolve(`auth=${input};`);
            }
        })

    })
}

// 获取用户信息
function getUserInfo() {
    return new Promise(async (resolve, reject) => {

        let resp = await axios.get(apiUrl.common.getUserInfo);

        data = resp.data;

        if (data.code != 1) {
            console.log(data.msg)
            resolve(data);
            return;
        }

        const { Cookie } = resp.config.headers;

        fs.writeFile('./config.json', JSON.stringify({
            Cookie
        }), (err) => {
            if (err) {
                console.error(err);
            }
            console.log('Cookie已保存');
        })

        const { userInfo } = data;

        console.log(`==用户信息输出==`);
        console.log(`${userInfo.DisplayName} - ${userInfo.UserName}`);
        console.log(`===============`);

        resolve(userInfo);

    })
}

// 获取课程列表
function getMyCourse() {
    return new Promise(async (resolve, rejcet) => {

        let resp = await axios.get(apiUrl.portal.getMyCourse, {
            params: {
                isFinished: 0,
                pageSize: 5000
            }
        })

        data = resp.data;

        // console.log(data);

        if (data.code != 1) {
            console.log(data.msg);
            resolve(data);
            return;
        }

        const { list } = data;

        console.log(`==课程列表==`);

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            console.log(`${i}. ${item.courseName} - ${item.process}%`);
        }

        console.log(`========`);

        resolve(list);

    })
}

// 获取模块列表 (进度列表)
function getProcessList(courseOpenId) {
    return new Promise(async (resolve, reject) => {

        let resp = await axios({
            method: 'post',
            url: apiUrl.study.learn.getProcessList,
            data: qs.stringify({
                courseOpenId
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        data = resp.data;

        if (data.code != 1) {
            console.log(data.msg);
            resolve(data);
            return;
        }

        // 判断上锁
        if (data.lockStatus) {
            console.log(`错误: 课程已上锁`)
            resolve(data);
        }

        let { moduleList } = data.proces;

        for (let i = 0; i < moduleList.length; i++) {
            const item = moduleList[i];
            item.courseOpenId = courseOpenId;
        }

        resolve(moduleList);

    })
}

// 为 获取模块列表 (上层)
function toGetProcessList(list) {
    return new Promise(async (resolve, rejcet) => {

        console.log("请输入课程序号: (如1)")

        rl.once('line', async (input) => {

            id = parseInt(input);
            if (isNaN(id) || id >= list.length || id < 0) {
                console.log(`错误: 输入错误!`);
                resolve(null);
            } else {
                processList = await getProcessList(list[id].courseOpenId);
                console.log(`==模块列表==`);
                for (let i = 0; i < processList.length; i++) {
                    const item = processList[i];
                    let isUnlock;
                    if (item.isUnlock) {
                        isUnlock = "";
                    } else {
                        isUnlock = " - 已上锁";
                    }
                    console.log(`${i}. ${item.name} - ${item.percent}%${isUnlock}`);
                }
                console.log(`${processList.length}. 完成所有模块未完成的项目`);
                console.log(`========`)
                resolve(processList);
            }
        })

    })
}

// 获取话题列表
function getTopicListByModuleId(courseOpenId, moduleId) {
    return new Promise(async (resolve, rejcet) => {

        let resp = await axios.get(apiUrl.study.learn.getTopicByModuleId, {
            params: {
                courseOpenId,
                moduleId
            }
        });

        data = resp.data;

        if (data.code != 1) {
            console.log(code.msg);
            resolve(data);
            return;
        }

        const { topicList } = data;

        resolve(topicList);
    })
}

// 获取cell列表
function getCellListByTopicId(courseOpenId, topicId) {
    return new Promise(async (resolve, rejcet) => {

        let resp = await axios.get(apiUrl.study.learn.getCellByTopicId, {
            params: {
                courseOpenId,
                topicId
            }
        });

        data = resp.data;

        if (data.code != 1) {
            console.log(data.msg);
            resolve(data);
            return;
        }

        const { cellList } = data;

        resolve(cellList);
    })
}

// 更新cell数据 记录时长
function statStuProcessCellLogAndTimeLong(cellObj) {
    return new Promise(async (resolve, reject) => {

        const { courseOpenId, categoryName, cellName } = cellObj,
            cellId = cellObj.Id;

        let data, resp;

        // 先分类
        if (categoryName == "视频") {

            // 先获取时长
            resp = await axios.get(apiUrl.study.learn.getModulsSliderList, {
                params: {
                    courseOpenId,
                    cellId
                }
            })
            data = resp.data;
            if (data.code != 1) {
                console.log(data.msg);
                resolve(data);
                return;
            }
            const { VideoTimeLong } = data.courseCell;
            console.log(`时长: ${parseInt(VideoTimeLong / 60)}分${VideoTimeLong % 60}秒`);

            // 然后更新记录
            resp = await axios.get(apiUrl.study.learn.statStuProcessCellLogAndTimeLong, {
                params: {
                    courseOpenId,
                    cellId,
                    auvideoLength: VideoTimeLong,
                    videoTimeTotalLong: VideoTimeLong
                }
            });
        } else {

            // 其他类型
            resp = await axios.get(apiUrl.study.learn.statStuProcessCellLogAndTimeLong, {
                params: {
                    courseOpenId,
                    cellId,
                    videoTimeTotalLong: 0
                }
            })
        }
        data = resp.data;
        // console.log(data);
        if (data.code != 1) {
            console.log(data.msg);
            resolve(data);
            return;
        };
        if (data.isStudy) {
            console.log(`学习完毕`);
        } else {
            console.log(`学习失败`)
        }
        resolve();
    })
}

// 添加评论区浏览记录
function addStuViewTopicRemember(item) {
    return new Promise(async (resolve, reject) => {

        const { courseOpenId, resId } = item,
            topicId = resId;

        resp = await axios.get(apiUrl.study.discussion.addStuViewTopicRemember, {
            params: {
                courseOpenId,
                topicId
            }
        });

        data = resp.data;

        if (data.code != 1) {
            console.log(data.msg);
            resolve(data);
            return;
        }

        console.log("讨论访问完毕");
        resolve(1);

    })
}



// 执行刷操作
function toDoIt(list) {
    return new Promise(async (resolve, rejcet) => {

        console.log(`请输入要刷的模块序号:`);

        rl.once('line', async (input) => {

            // 判断输入是否整数,且在范围内
            id = parseInt(input);
            if (isNaN(id) || id < 0 || id > list.length) {
                console.log(`错误: 请输入正确的数值!`);
                resolve(null);
            } else {

                // 执行函数操作
                if (id == list.length) {
                    await toDoAllModule(list);
                } else {
                    await toDoTopic(list[id].courseOpenId, list[id].id);
                }

            }

        })

    })
}

// 处理所有模块的子函数
function toDoAllModule(list) {
    return new Promise(async (resolve, reject) => {

        console.log(`正在执行全部模块完成操作...`);

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            console.log(`正在执行第${i + 1}个模块: ${item.name}, 共${list.length}个模块`);
            if (item.percent != 100) {
                await toDoTopic(item.courseOpenId, item.id);
            }
        }

    })
}

// 处理当前话题(下的所有cell)
function toDoTopic(courseOpenId, moduleId) {
    return new Promise(async (resolve, rejcet) => {

        // 获取topic
        topicList = await getTopicListByModuleId(courseOpenId, moduleId);

        if (!topicList) {
            resolve(topicList);
            return;
        }

        console.log(`该模块总计${topicList.length}个话题`);

        for (let topicCount = 0; topicCount < topicList.length; topicCount++) {
            const topic = topicList[topicCount];
            let studyStatus;
            console.log(`正在执行第${topicCount + 1}个话题: ${topic.name}, 共${topicList.length}个话题`);
            if (topic.studyStatus == -1) studyStatus = "未学习";
            if (topic.studyStatus == 0) studyStatus = "部分学习";
            if (topic.studyStatus == 1) studyStatus = "已学习";
            console.log(`状态: ${studyStatus}`);
            if (topic.studyStatus != 1) {
                await toDoCell(courseOpenId, topic.id);
                await wait(randomNum(0, 3) * 1000);
            }
        }
        resolve();

    })
}

// 处理cell
function toDoCell(courseOpenId, topicId) {
    return new Promise(async (resolve, rejcet) => {

        cellList = await getCellListByTopicId(courseOpenId, topicId);

        await toDoCellFunc(cellList);

        resolve();

    })
}

// 处理cell（循环
function toDoCellFunc(cellList) {

    return new Promise(async (resolve, reject) => {


        for (let cellCount = 0; cellCount < cellList.length; cellCount++) {

            const item = cellList[cellCount];
            console.log(`正在执行第${cellCount + 1}个cell: ${item.cellName}, 共${cellList.length}个cell`)

            let studyStatus;
            if (item.isStudyFinish) {
                studyStatus = "已学习";
            } else {
                studyStatus = "未学习";
            }

            console.log(`状态: ${studyStatus}`);
            if (item.isStudyFinish) {
                continue;
            }

            switch (item.cellType) {
                case 1:
                    console.log(`类型: [${item.cellType}] ${item.categoryName}`);
                    await statStuProcessCellLogAndTimeLong(item);
                    break;

                // 为什么会有子节点这种恶心的东西
                case 4:
                    console.log(`类型: [${item.cellType}] 子节点 共${item.childNodeList.length}个`);
                    await toDoCellFunc(item.childNodeList);
                    break;

                case 8:
                    console.log(`类型: [${item.cellType}] 讨论`);
                    await addStuViewTopicRemember(item);
                    break;

                default:
                    console.log(`未知类型: [${item.cellType}] ${item.categoryName}`);
                    break;
            }

        }

        resolve();
    })

}

// 随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

// 延迟
function wait(ms) {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve();
        }, ms)

    })
}
