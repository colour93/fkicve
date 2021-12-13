// ==UserScript==
// @name         HBSI助手
// @namespace    https://assistant.hbsi.fur93.icu
// @version      0.2.1110
// @description  嗯 
// @author       玖叁 (colour93) <colour_93@furry.top>
// @match        *://next.change.tm/*
// @match        *://mooc.icve.com.cn/*
// @match        *://zjy2.icve.com.cn/*
// @icon         http://assistant.fur93.icu/static/hbsi.png
// @updateURL    http://assistant.fur93.icu/HBSI.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @resource css https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css
// ==/UserScript==

(async function() {
    'use strict';

    GM_addStyle(GM_getResourceText("css"));

    // ===============启嘉助手 模块===============
    if (window.location.hostname == "next.change.tm") {

        // 初始化变量
        const getLevelResourceURL = "http://next.change.tm/api/student/Course/getLevelResource";
        const getResourceDetailURL = "http://next.change.tm/api/student/Course/getResourceDetail";
        const setLevelArticleURL = "http://next.change.tm/api/student/Course/setLevelArticle";
        const token = localStorage.getItem("[application]token");
        let url = window.location;
    
        // ---------一键通关 模块---------
        if (window.location.pathname == "/course/CourseDetail") {
            
            // 绑定样式
            let style = document.createElement("style");
            style.type = "text/css";
            let text = document.createTextNode(".float-btn{position:fixed;right:40px;top:50vh;width:auto;height:48px;color:#fff;text-align:center;cursor:pointer;border-radius:10px;border:none;padding:0 10px 0 10px;background-color:#237cec;transition:all 0.25s;color:#fff;}.float-btn:hover,.float-btn:disabled{background-color:#1856a1;}");
            style.appendChild(text);
            let head = document.getElementsByTagName("head")[0];
            head.appendChild(style);
            let floatBtn = '<button class="float-btn" id="oneClickToLoad">一键加载</button>';
            let body = $("body");
            body.prepend(floatBtn);
        
            // 按钮绑定
            $("#oneClickToLoad").click(async function () {
                $(this).html('正在执行');
                $(this).attr("disabled", "disabled");
                let result = await rollSetLevelArticle();
                if (result=='ok') {
                    alert("操作完毕，即将刷新页面\n请注意，实际学习进度除了与加载出的课件有关外，实际操作题的运行也占一部分\n本插件不会自动做题");
                    window.location.reload();
                }
            });
        
        }
        
        // ---------基础操作函数---------

        // 循环解锁等级限制
        function rollSetLevelArticle () {
            return new Promise ( async (resolve, reject) => {
    
                let x = {};
    
                // 按次循环 防gank
                for (let i = 0; i < 300; i++) {
                    x = await setLevelArticle();
                    if (x.code == 0) {
                        resolve('ok');
                        break;
                    }
                }
                resolve('not ok');
            })
        }
    
        // 解锁等级限制
        function setLevelArticle () {
            return new Promise ( async (resolve, reject) => {
    
                // 由URL初始化变量
                let { course_id } = getQueryArgs(window.location.search);
                let level_content_id = getQueryArgs(window.location.search).id;
    
                // 发送请求
                axios({
                    method: 'post',
                    url: setLevelArticleURL,
                    data: {
                        level_content_id, course_id
                    },
                    headers: {token}
                })
                    .then((resp) => {
                        if (resp.data.data == "{-null-}") {
                            resolve({code:0});
                            return;
                        };
                        console.log(resp.data);
                        resolve(resp.data);
                    });
            })
        }
        
        // 获取资源详情
        function getResourceDetail (resourceId) {
            return new Promise ( async (resolve, reject) => {
    
                
            })
        }
    
        // 获取课程资源
        function getLevelResource () {
            return new Promise ( async (resolve, reject) => {
    
                // 由URL初始化变量
                let { course_id } = getQueryArgs(window.location.search);
                let level_content_id = getQueryArgs(window.location.search).id;
        
                // 发送请求
                axios({
                    method: 'get',
                    url: getLevelResourceURL,
                    params: {
                        level_content_id, course_id
                    },
                    headers: {token}
                })
                    .then((resp) => {
                        console.log(resp.data);
                        resolve(resp.data);
                    });
            })
        }
        
    }


    // ===============职教云mooc助手 模块===============
    if (window.location.hostname == "mooc.icve.com.cn") {

        const   _self = unsafeWindow,
                top = _self;

        try {
            while (top != _self.top) top = top.parent.document ? top.parent : _self.top;
        } catch (err) {
            console.log(err);
            top = _self;
        }

        // ---------课程预览 模块---------
        if (window.location.pathname == "/study/courseLearn/process.html") {
            
        }
        
        // ---------课程详情 模块---------
        if (window.location.pathname == "/study/courseLearn/resourcesStudy.html") {

            // 初始化全局API地址
            const getViewDirectoryURL = "https://mooc.icve.com.cn/study/learn/viewDirectory";
            const getQuestionInfoURL = "https://mooc.icve.com.cn/study/learn/getQuestionInfo";
            
            // 初始化全局变量
            let courseDetail;
            let loadingToast;
            let switchStat;
            let autoPlay;

            // 等待DOM载入
            window.onload = () => {

                // console.log($('#olTempleteCellModul'))

                // 挂载载入提示
                $("body").append(`<div class="toast-container position-absolute bottom-0 end-0 p-3"><div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="toolBoxLoading" data-bs-autohide="false"><div class="d-flex"><div class="toast-body"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>                HBSI助手 - 职教云MOOC模块 载入中...</div></div></div></div>`)
                loadingToast = new bootstrap.Toast($("#toolBoxLoading"));
                // 显示提示
                loadingToast.show();

                // 全局初始化
                initialize();
                
                // docPlay监听器
                // 用于监听页面变更
                let contentListner = new MutationObserver(async()=>{
                    console.log("[HSBI助手] 信息重载");
                    await initialize();
                });
                contentListner.observe($("#docPlay")[0], {
                    childList: true
                });

            }
            
            // 全局信息初始化函数
            function initialize () {
                return new Promise (async (resolve, reject) => {

                    courseDetail = await getViewDirectory();

                    switchStat = 0;

                    cate();
                })
            }

            // 分类检测
            function cate () {
                // let cate = $("li.np-section-level.np-section-level-3.active").data().categoryname;
                let cateName = courseDetail.courseCell.CategoryName;
                console.log(cateName)
                switch (cateName) {
                    case "视频":
                        videoInitialize();
                        break;
                
                    case "ppt": case "pdf文档": case "文档": case "office文档": case "ppt文档":
                        docInitialize();
                    default:
                        break;
                }
            }

            // 获取课程详细信息函数
            function getViewDirectory() {
                return new Promise ( async (resolve, reject) => {
                    const { fromType, courseOpenId, cellId, moduleId } = getQueryArgs(window.location.search);
                    const { cellIdHash } = getHash(window.location.hash);
                    const cfg = {
                        method: 'get',
                        url: getViewDirectoryURL,
                        params: {
                            cellIdHash, courseOpenId, cellId, moduleId, fromType
                        }
                    };
                    axios(cfg).then((resp)=>{
                        loadingToast.hide();
                        resolve(resp.data);
                    })

                })
            }

            // 视频类型初始化函数
            async function videoInitialize () {
                
                // 初始化播放器对象
                let player = top.jwplayer($(".jwplayer").attr("id"));
                
                // 初始化工具箱
                toolBoxInitialize('video', {player});
                
                // 初始化播放倍速&自动答题
                let autoAnswer = parseInt(localStorage.getItem("[hbsiTB]autoAnswer"));
                let playRate = parseInt(localStorage.getItem("[hbsiTB]playRate"));
                player.setPlaybackRate(playRate);

                // 获取视频问题
                if (courseDetail.videoQuestionList) {
                    let questionList = [];
                    for (let i = 0; i < courseDetail.videoQuestionList.length; i++) {
                        const e = courseDetail.videoQuestionList[i];
                        const { QuestionId, CellId, QuestionTime } = e;

                        let cfg = {
                            method: 'get',
                            url: getQuestionInfoURL,
                            params: {
                                QuestionId, CellId,
                                time: QuestionTime
                            }
                        }

                        await axios(cfg).then((resp)=>{
                            console.log(resp.data);

                            // 处理答案
                            let answer;
                            for (let i = 0; i < resp.data.question.AnswerList.length; i++) {
                                const e = resp.data.question.AnswerList[i];
                                if (e.IsAnswer == "true") {
                                    answer = i;
                                    break;
                                };
                            };
                            let result = {
                                time: parseInt(QuestionTime),
                                answer
                            };
                            
                            questionList.push(result);

                        })
                        
                    }

                    // 添加监听器
                    // 用于监听视频暂停
                    player.on('pause', ()=>{

                        // 判断是否开启自动答题
                        if (!autoAnswer) {
                            return;
                        }

                        // 获取当前时间
                        let currentTime = parseInt(player.getCurrentTime());

                        // 遍历所有问题
                        for (let i = 0; i < questionList.length; i++) {
                            const e = questionList[i];

                            // 判断时间是否匹配
                            if (currentTime == e.time) {
                                setTimeout(() => {
                                    // 选择答案
                                    console.log(`[HBSI助手] 答案为 ${e.answer}`);
                                    $(`li.e-a.doAnswer[data-index="${e.answer}"]`)[0].click();
                                    $(".ui-dialog-buttonset button.ui-button.ui-corner-all.ui-widget").click();
                                    
                                }, 1000);

                            }
                        }
                    })

                    // 添加监听器
                    // 用于监听视频是否播放完毕
                    player.on('complete', ()=>{
                        console.log("[HBSI助手] 视频播放完毕");
                        switchNextOne();
                    })
                }
                
            }

            // 文档类型初始化函数
            function docInitialize () {

                // 初始化工具箱
                console.log("[HBSI助手] 文档类型初始化");
                toolBoxInitialize('doc');
                switchNextOne();
            }
            
            // 初始化工具箱函数
            function toolBoxInitialize (type, options) {
                
                // 工具箱类型
                switch (type) {
                    case 'video':
                        
                        // 视频工具箱
                        console.log("[HBSI助手] 视频工具箱初始化");

                        // 播放倍速&自动答题
                        let {player} = options;
                        let playRate = parseInt(localStorage.getItem("[hbsiTB]playRate"));
                        let autoAnswer = parseInt(localStorage.getItem("[hbsiTB]autoAnswer"));

                        // 判断是否已载入
                        if ($("#hbsi-toolBox")) {
                            $("#hbsi-toolBox").remove();
                        };

                        // 清除样式
                        $("ul#topDirectorUl").attr("style","float: left;margin-left: 60px;");
                        
                        // 挂载工具箱按钮
                        let toolBoxA = `<li id="hbsi-toolBox"><a id="toolBoxA" data-bs-toggle="modal" data-bs-target="#toolBoxModal">工具箱</a></li>`;
                        let ul = $("ul.am-nav.am-nav-pills.am-topbar-right.admin-header-list");
                        ul.append(toolBoxA);
            
                        // 挂载工具箱modal
                        let toolBoxModal = `<div class="modal fade" id="toolBoxModal" tabindex="-1" aria-labelledby="toolBoxModalTitle" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="toolBoxModalTitle">工具箱设置</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="autoPlayCheck"><label class="form-check-label" for="autoPlayCheck">                      自动挂机</label></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="autoAnswerCheck"><label class="form-check-label" for="autoAnswerCheck">                      自动答题</label></div><br><div class="playRate"><label for="playRateRange" class="form-label">播放倍速</label><span id="playRateRangeSpan"></span><input type="range" class="form-range" min="1" max="8" step="1" id="playRateRange" onchange="document.getElementById('playRateRangeSpan').innerHTML=value"></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveSettingsBtn">确定</button></div></div></div></div>`;
                        let body = $("body");
                        body.append(toolBoxModal);

                        // 若是初次使用
                        if(!playRate) {
                            playRate = player.getPlaybackRate();
                            localStorage.setItem("[hbsiTB]playRate",playRate);
                        };
                        if(isNaN(autoAnswer)) {
                            autoAnswer = 0;
                            localStorage.setItem("[hbsiTB]autoAnswer",autoAnswer);
                        };

                        

                        // 初始化工具箱显示数值
                        $('#playRateRangeSpan')[0].innerHTML = playRate;
                        $('#playRateRange')[0].value = playRate;
                        if (autoAnswer) {
                            $('#autoAnswerCheck').prop('checked', 'checked');
                        };

                        // 添加工具箱保存监听
                        document.getElementById('saveSettingsBtn').addEventListener('click',() => {
            
                            // 设置倍速
                            playRate = parseInt(document.getElementById('playRateRange').value);
                            localStorage.setItem("[hbsiTB]playRate", playRate);
                            options.player.setPlaybackRate(playRate);
                            console.log(`[HBSI助手] ${playRate}倍速`);

                            // 设置自动挂机
                            console.log($('#autoPlayCheck').prop('checked'))
                            if (!$('#autoPlayCheck').prop('checked')) {
                                autoPlay = 0;
                            } else {
                                autoPlay = 1;
                            };
                            localStorage.setItem("[hbsiTB]autoPlay", autoPlay);
                            console.log(`[HBSI助手] 自动挂机 ${autoPlay}`)
                            
                            // 设置自动答题
                            if (!$('#autoAnswerCheck').prop('checked')) {
                                autoAnswer = 0;
                            } else {
                                autoAnswer = 1;
                            };
                            localStorage.setItem("[hbsiTB]autoAnswer", autoAnswer);
                            console.log(`[HBSI助手] 自动答题 ${autoAnswer}`)
                            
                        })

                        break;
                    
                    case 'doc':

                        console.log("[HBSI助手] 文档工具箱已载入")
                        
                        // 判断是否已载入
                        if ($("#hbsi-toolBox")) {
                            $("#hbsi-toolBox").remove();
                        };

                    default:
                        break;
                }

                // 读取参数
                autoPlay = parseInt(localStorage.getItem("[hbsiTB]autoPlay"));

                // 判断是否初次使用
                if (isNaN(autoPlay)) {
                    autoPlay = 0;
                    localStorage.setItem("[hbsiTB]autoPlay", autoPlay);
                }

                // 初始化数值
                if (autoPlay) {
                    $('#autoPlayCheck').prop('checked', 'checked');
                }
            }

            // 切换下一个函数
            async function switchNextOne () {

                // 判断是否正在切换 & 是否打开自动切换
                if (switchStat || !autoPlay) {
                    return;
                };

                switchStat = 1;
                console.log("[HBSI助手] 正在切换下一个");

                // 检查播放列表DOM是否渲染
                if (!$('#olTempleteCellModul')[0].innerHTML) {

                    _switchListner().then(()=>{
                        $(".next.fr")[0].click();
                    })

                    function _switchListner () {
                        return new Promise ( (resolve, reject) => {
                            // 监听切换按钮是否渲染
                            let switchListner = new MutationObserver(async()=>{
                                console.log("[HSBI助手] 切换按钮DOM加载完毕");
                                resolve(1);
                            });
                            switchListner.observe($("#olTempleteCellModul")[0], {
                                childList: true
                            });
                        })
                    }
                } else {
                    $(".next.fr")[0].click();
                }
                
            }
            
        }

        // ---------作业 模块---------
        if (window.location.pathname == "/study/workExam/homeWork/preview.html") {

            // 等待DOM加载
            window.onload = () => {
                initialize();
            }

            // 初始化
            function initialize() {
                uncageCopyLimit();
            }
        }

        // ---------测验 模块---------
        if (window.location.pathname == "/study/workExam/testWork/testWork.html") {

            console.log("[HBSI助手] 测验模块")

            // API地址
            const getExamListURL = "https://mooc.icve.com.cn/study/workExam/getWorkExamList",
                getExamPreviewURL = "https://mooc.icve.com.cn/study/workExam/workExamPreview",
                onlineExamAnswerURL = "https://mooc.icve.com.cn/study/workExam/onlineHomeworkAnswer",
                saveExamURL= "https://mooc.icve.com.cn/study/workExam/workExamSave";

            // DOM加载
            window.onload = () => {

                // 注入HTML
                $('.am-form-group.am-input-group-sm').append('<button id="doTestBtn-70" type="button" class="btn btn-primary" style="margin-left:3px;">完成测验(正确率>70%)</button>');
                $('.am-form-group.am-input-group-sm').append('<button id="doTestBtn-100" type="button" class="btn btn-outline-primary" style="margin-left:3px;">完成测验(满分)</button>');

                $('#doTestBtn-100').click(async function() {
                    await doAllExam(15, 5, 0.9);
                })

            }

            // 获取测验列表
            // m --> 是否筛选未做
            async function getExamList(m) {

                return new Promise ( async ( resolve, reject ) => {

                    // 获取参数
                    const {courseOpenId} = getQueryArgs(window.location.search);
    
                    let result,
                        list = [];
    
                    // 发请求
                    result = await axios.get(getExamListURL, {
                        params: {
                            workExamType: 1,
                            courseOpenId,
                            pageSize: 5000
                        }
                    }).then((resp)=>{
                        return resp.data;
                    });

                    for (let i = 0; i < result.list.length; i++) {
                        const e = result.list[i];
                        if (m) {
                            if (!e.IsDoExam) {
                                list.push(e);
                            }
                        } else {
                            list.push(e);
                        }
                    }
    
                    resolve(list);

                })

            }

            // 获取测验题目
            async function getExamPreview(workExamId) {

                return new Promise ( async ( resolve, reject ) => {

                    let result;

                    result = await axios.get(getExamPreviewURL, {
                        params: {
                            workExamId
                        }
                    }).then((resp)=>{
                        return resp.data;
                    })

                    resolve(result);

                } )

            }

            // 提交答案
            // c --> 正确率
            async function onlineExamAnswer(workExamObj, c) {

                return new Promise ( async ( resolve, reject ) => {

                    let result,
                        workExamData = JSON.parse(workExamObj.workExamData),
                        uniqueId = workExamObj.uniqueId,
                        questions = workExamData.questions,
                        questionsList = [];

                    // 生成问题-答案列表
                    for (let i = 0; i < questions.length; i++) {
                        const question = questions[i];
                        questionsList.push({
                            questionId: question.questionId,
                            Answer: question.Answer,
                            questionType: question.questionType,
                            uniqueId
                        })
                    }

                    for (let j = 0; j < questionsList.length; j++) {
                        let question = questionsList[j];
                        if (Math.random() < (1-c)) {
                            question.Answer = rnd(0, 3).toString();
                        };
                        result = await axios.get(onlineExamAnswerURL, {
                            params: question
                        }).then((resp)=>{
                            return resp.data;
                        });
                    }

                    resolve(workExamObj);

                } )

            }

            // 提交测验
            // t --> 每道题用时
            // d --> 上下区间
            async function saveExam(workExamObj, t, d) {

                return new Promise ( async ( resolve, reject ) => {

                    let result,
                        workExamData = JSON.parse(workExamObj.workExamData),
                        uniqueId = workExamObj.uniqueId,
                        workExamId = workExamObj.homework.Id,
                        workExamType = workExamObj.homework.PaperType,
                        count = workExamData.questions.length,
                        useTime;

                    if (!t) {
                        t = 20;
                    };

                    if (!d) {
                        d = 5;
                    }

                    // 计算时间
                    useTime = t * count;
                    for (let i = 0; i < count; i++) {
                        useTime += rnd(t-d, t+d);
                    }

                    // 提交
                    result = await axios.get(saveExamURL, {
                        params: {
                            uniqueId,
                            workExamId,
                            workExamType,
                            useTime
                        }
                    })

                    resolve(result);


                } )

            }

            // 自动刷测验
            // t --> 每道题用时
            // d --> 上下区间
            // c --> 正确率
            async function doAllExam (t, d, c) {

                return new Promise ( async ( resolve, reject ) => {

                    let result, r;
                    result = await getExamList(1)
                        .then(data=>{
                            return data
                        })

                    for (let i = 0; i < 3; i++) {

                        setTimeout( async function timer() {

                            const item = result[i];
                            r = await getExamPreview(item.Id)
                                .then(data=>onlineExamAnswer(data, c))
                                .then(data=>saveExam(data, t, d))
                            console.log(r);

                         }, i*10000 );
                    }

                } )

            }

        }

        // ---------具体测验页面----------
        if (window.location.pathname == "/study/workExam/testWork/preview.html") {

            window.onload = () => {
                uncageCopyLimit();
            }

        }

        // ---------职教云mooc通用函数---------
        // 解除复制限制
        function uncageCopyLimit() {
            let arr = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "oncopy", "onbeforecopy"]
            for (let i of arr)
                $(".hasNoLeft").attr(i, "return true")
            console.log("[HBSI助手] 复制限制已解除")
        }

    }

    // ===============职教云助手 模块===============
    if (window.location.hostname == "zjy2.icve.com.cn") {

        // ======作业模块=======
        if (window.location.pathname == "/study/homework/do.html") {
            window.onload = () => {
                uncageCopyLimit();
            }
        }

        // ---------职教云通用函数---------
        // 解除复制限制
        function uncageCopyLimit() {
            let arr = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "oncopy", "onbeforecopy"]
            for (let i of arr)
                $(".hasNoLeft").attr(i, "return true")
            console.log("[HBSI助手] 复制限制已解除")
        }

    }


    // ---------常规函数---------

    // 处理URL查询参数
    function getQueryArgs(urlQueryStr){
    var qs = (urlQueryStr.length > 0 ? urlQueryStr.substring(urlQueryStr.indexOf('?')).substr(1) : ''),
        //保存每一项
        args = {},
        //得到每一项
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;

        for(i = 0;i<len ;i++){
            item = items[i].split('='),
            name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1])
            if(name.length){
                args[name] = value;
            }
        }
        return args;
    }

    // 处理URLhash参数
    function getHash(urlHash){
        urlHash = urlHash.substring(1);
        let urlHashAry = urlHash.split('=');
        // return urlHashAry
        let resultStr = `{"${urlHashAry[0]}":"${urlHashAry[1]}"}`;
        return JSON.parse(resultStr);
    }

    // 随机数
    function rnd(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    }

    

})();