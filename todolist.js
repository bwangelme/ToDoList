/*
事件侦听对象 EventUtil.addHandler(element,type,handler)
 */
var EventUtil={
    addHandler:function (element,type,handler) {
        if(element.addEventListener){
            return element.addEventListener(type,handler,false);
        }
        else if(element.attachEvent){
            return  element.attachEvent("on"+type,handler);
        }
        else {
            return element["on"+type]=handler;
        }
    },
    removeHandler:function (element,type,handler) {
        if(element.removeEventListener){
            return element.removeEventListener(type,handler,false);
        }
        else if(element.detachEvent){
            return element.detachEvent("on"+type,handler);
        }
        else {
            element["on"+type]=null;
        }
    },
    preventDefault:function (event) {
        if (event.preventDefault){
            event.preventDefault();
        }
        else {
            event.returnValue=false;
        }
    },
    getEvent:function (event) {
        return event?event:window.event;
    },
    getTarget:function(event) {
        return event.target||event.srcElement;
    }
};

var doingitems=new Array();
    doingitems=(localStorage.getItem("ToDoList_doing"))?JSON.parse(localStorage.getItem("ToDoList_doing")):[];
var finisheditems=new Array();
    finisheditems=(localStorage.getItem("ToDoList_finished"))?JSON.parse(localStorage.getItem("ToDoList_finished")):[];
//alert(doingitems instanceof Array);
load();

//console.log(doingitems);
function addItem(){
    var item=document.getElementById("title");
    if(item.value){
        //添加任务对象到数组
        doingitems.push(item.value);
        item.value=null;
        //读取文档数据并显示
        load();
    }
}





EventUtil.addHandler(document.getElementById("doinglists"),"click",clickEvent);
EventUtil.addHandler(document.getElementById("finishlists"),"click",clickEvent);

function clickEvent(event){
    var event=EventUtil.getEvent(event);
    var target=EventUtil.getTarget(event);
    switch(target.tagName.toLowerCase()){
        //勾选或者取消“checkbox”
        case "input":
            if (target.type=="checkbox") {
                delElement(target);
                addELement(target);
                load();
            }
            break;
        //删除某个任务
        case "span":
            delElement(target);
            load();
            break;
        //点击item名称，进行名称更改
        case "p":
            editInformation(target);
            break;
    }
}
//将item添加到“已经完成”或者放回“正在进行中”
function addELement(element){
    var p=element.nextElementSibling;
    var itemValue=p.innerHTML;
    if (element.checked) {
        finisheditems.push(itemValue);
    }
    else if (!element.checked) {
        doingitems.push(itemValue);
    }
}
//从“正在进行”或“已经完成”数组中删除
function delElement(element){
    if (element.parentNode.parentNode.id=="doinglists") {
        doingitems.splice(element.parentNode.index,1);
    }
    else if (element.parentNode.parentNode.id=="finishlists") {
        finisheditems.splice(element.parentNode.index,1);
    }
}
//通过click事件点击修改单个item信息，
function editInformation(element){
    var content=element.innerHTML;
    element.innerHTML='<input id="p-input" type="text" value="'+content+'">';
    var input=document.getElementById("p-input");
    input.focus();
    input.select();
    EventUtil.addHandler(input,"blur",changeInformation);
    //失去焦点时保存并立即显示修改后的item信息
    function changeInformation(event){
        var p=this.parentNode;
        p.innerHTML=this.value;
        var li=p.parentNode;
        if (li.className=="doinglists") {
            doingitems.splice(li.index,1,li);
        }
        else if (li.className=="finishlists") {
            finisheditems.splice(li.index,1,li);
        }
    }
}





/*
将存储的元素数组添加到DOM树中，并展示相关信息
*/
function load(){
    var doingcount=document.getElementById("doingcount");
    doingcount.innerHTML=doingitems.length;
    var doingul=document.getElementById("doinglists");
    doingul.innerHTML="";
    localStorage.setItem("ToDoList_doing",JSON.stringify(doingitems));
    setLists(doingitems,doingul,"doinglists");

    var finishcount=document.getElementById("finishcount");
    finishcount.innerHTML=finisheditems.length;
    var finishul=document.getElementById("finishlists");
    finishul.innerHTML="";
    localStorage.setItem("ToDoList_finished",JSON.stringify(finisheditems));
    setLists(finisheditems,finishul,"finishlists");

    function setLists(lists,ul,cla){
        var input;
        if(cla=="doinglists"){
            input='<input type="checkbox">';
        }
        else if (cla=="finishlists"){
            input='<input type="checkbox" checked="checked">';
        }
        for (var i = 0 ; i < lists.length; i++) {
            var li=document.createElement("li");
            li.className=cla;
            li.index=i;
            li.innerHTML=input+'<p>'+lists[i]+'</p><span>-</span>';
            ul.appendChild(li);
        }
    }
}




/*
清楚所有item
*/
function clearItems(){
    localStorage.clear();
    doingitems=[];
    finisheditems=[];
    load();
}







