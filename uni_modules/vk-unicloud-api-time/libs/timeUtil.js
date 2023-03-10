/**
 * 时间工具类
 */
var util = {};

/**
 * 获取时间范围
 * @params {Date} date 日期对象 可以指定时间计算节点，默认使用当前时间进行计算
 * 返回的是时间戳(防止时区问题)
 * 返回数据如下：
 {
   todayStart 今日开始时间
   todayEnd   今日结束时间
   today12End 今日上午结束时间
   monthStart 本月开始时间
   monthEnd   本月结束时间
   yearStart  本年开始时间
   yearEnd    本年结束时间
   weekStart  本周开始时间
   weekEnd    本周结束时间
   now        现在的时间点(含月年日时分秒)
   months     本年度每月的开始和结束时间 months[1] 代表1月
 }
 * getCommonTime();
 */
util.getCommonTime = function(date = new Date(), targetTimezone = 8) {
	let res = {};
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	
	const { year, month, day, hour, minute, second } = util.getFullTime(date, 2);
	// 现在的时间
	res.now = {
		year, month, day, hour, minute, second
	};
	// 获取本月最大天数
	let month_last_day = new Date(year, month, 0).getDate();
	// 获取今年12月最大天数
	let year_last_day = new Date(year, 12, 0).getDate();
	// 今日开始时间
	res.todayStart = new Date(`${year}/${month}/${day}`).getTime() - timeDif;
	// 今日12点时间
	res.today12End = new Date(`${year}/${month}/${day}`).getTime() + (12 * 60 * 60 * 1000 - 1) - timeDif;
	// 今日结束时间
	res.todayEnd = new Date(`${year}/${month}/${day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	// 本月开始时间
	res.monthStart = new Date(`${year}/${month}/1`).getTime() - timeDif;
	// 本月结束时间
	res.monthEnd = new Date(`${year}/${month}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	// 本年开始时间
	res.yearStart = new Date(`${year}/1/1`).getTime() - timeDif;
	// 本年结束时间
	res.yearEnd = new Date(`${year}/12/${year_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	let weekObj = util.getWeekStartAndEnd(0, date);
	// 本周开始时间
	res.weekStart = weekObj.weekStart;
	// 本周结束时间
	res.weekEnd = weekObj.weekEnd;
	// 本年1-12月的起止时间
	res.months = [];
	res.months[0] = {
		monthStart : res.monthStart,
		monthEnd : res.monthEnd
	};
	for(let i = 1;i<=12;i++){
		// 获取此月最大天数
		let month_last_day = new Date(year, i, 0).getDate();
		// 此月开始时间
		let monthStart = new Date(`${year}/${i}/1`).getTime() - timeDif;
		// 此月结束时间
		let monthEnd = new Date(`${year}/${i}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
		res.months[i] = {
			monthStart,
			monthEnd
		};
	}
	return res;
};


/**
 * 日期格式化
 * @params {Date || Number} date 需要格式化的时间
 * vk.pubfn.timeFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
 */
util.timeFormat = function(time, fmt = 'yyyy-MM-dd hh:mm:ss', targetTimezone = 8) {
	if(!time){
		return "";
	}
	// 其他更多是格式化有如下:
	// yyyy-MM-dd hh:mm:ss|yyyy年MM月dd日 hh时MM分等,可自定义组合
	let date;
	if(typeof time === "number"){
		if (time.toString().length == 10) time *= 1000;
		date = new Date(time);
	}else{
		date = time;
	}
	
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	const east8time = date.getTime() + timeDif;
	
	date = new Date(east8time);
	let opt = {
		"M+" : date.getMonth()+1,                 //月份   
		"d+" : date.getDate(),                    //日   
		"h+" : date.getHours(),                   //小时   
		"m+" : date.getMinutes(),                 //分   
		"s+" : date.getSeconds(),                 //秒   
		"q+" : Math.floor((date.getMonth()+3)/3), //季度   
		"S"  : date.getMilliseconds()             //毫秒   
	};
	if(/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
	}
	for(let k in opt){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (opt[k]) : (("00"+ opt[k]).substr((""+ opt[k]).length))); 
		}
	}
	return fmt;
};

/**
 * 日期对象转换(云函数端会自动转成东八区时间)
 * @params {Date || Number} date 需要转换的时间
 * @params {Number} type 转换方式
 * type = 0 返回 2020-08-03 12:12:12
 * type = 1 返回 20200803121212
 * type = 2 返回 { YYYY, MM, DD, hh, mm, ss }
 */
util.getFullTime = function(date, type=0, targetTimezone = 8) {
	if(!date){
		return "";
	}
	if(typeof date == "number"){
		date = new Date(date);
	}
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	const east8time = date.getTime() + timeDif;
	date = new Date(east8time);
	
	let YYYY = date.getFullYear() + '';
	let MM = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
	let DD = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
	let hh = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours());
	let mm = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
	let ss = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
	if(type === 2){
		return {
			YYYY : Number(YYYY),
			MM : Number(MM),
			DD : Number(DD),
			hh : Number(hh),
			mm : Number(mm),
			ss : Number(ss),

			year : Number(YYYY),
			month : Number(MM),
			day : Number(DD),
			hour : Number(hh),
			minute : Number(mm),
			second : Number(ss),
		};
	}else if(type === 1){
		return YYYY +""+ MM +""+ DD +""+ hh +""+ mm +""+ ss;
	}else{
		return YYYY +"-"+ MM +"-"+ DD +" "+ hh +":"+ mm +":"+ ss;
	}
};

/**
 * 获得相对当前周addWeekCount个周的起止日期
 * @params {Number} addWeekCount  默认0 (0代表本周 为-1代表上周 为1代表下周以此类推 为2代表下下周)
 */
util.getWeekStartAndEnd = function(addWeekCount = 0, date = new Date(), targetTimezone = 8) {
	let res = {};
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	const east8time = date.getTime() + timeDif;
	const east8Date = new Date(east8time);
	// 返回date是一周中的某一天
	let week = east8Date.getDay();
	// 返回date是一个月中的某一天
	let month = east8Date.getDate();
	// 一天的毫秒数
	let oneDayMillisecond = 1000 * 60 * 60 * 24;
	// 相对于当前日期addWeekCount个周的日期
	date = new Date(date.getTime() + (oneDayMillisecond * 7 * addWeekCount));
	// 减去的天数
	let minusDay = week != 0 ? week - 1 : 6;
	let weekStart = new Date(date.getTime() - (oneDayMillisecond * minusDay));
	let weekEnd = new Date(weekStart.getTime() + (oneDayMillisecond * 6));
	let weekStartObj = util.getFullTime(weekStart,2);
	let weekEndObj = util.getFullTime(weekEnd,2);
	// 获得当前周的第一天
	res.weekStart = new Date(`${weekStartObj.year}/${weekStartObj.month}/${weekStartObj.day}`).getTime() - timeDif;
	// 获得当前周的最后一天
	res.weekEnd = new Date(`${weekEndObj.year}/${weekEndObj.month}/${weekEndObj.day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	return res;
}
export default util;