/*==================================================
                ZKR.JS PART 1
==================================================*/

"use strict";

/*=====================================
            ELEMENTS
=====================================*/

const clock = document.getElementById("clock");
const date = document.getElementById("date");
const hijri = document.getElementById("hijri");

const buttons = document.querySelectorAll(".menu-btn");

/*=====================================
            CLOCK
=====================================*/

function updateClock(){

    const now = new Date();

    const time = now.toLocaleTimeString("en-GB",{

        hour12:false

    });

    if(clock){

        clock.textContent = time;

    }

}

setInterval(updateClock,1000);

updateClock();

/*=====================================
            DATE
=====================================*/

function updateDate(){

    const now = new Date();

    const options = {

        weekday:"long",

        year:"numeric",

        month:"long",

        day:"numeric"

    };

    if(date){

        date.textContent =
        now.toLocaleDateString("ar-EG",options);

    }

}

updateDate();

/*=====================================
            HIJRI DATE
=====================================*/

function updateHijri(){

    const now = new Date();
}
/*==================================================
                ZKR.JS PART 2
==================================================*/

/*=====================================
        PRAYER API
=====================================*/

const egyptPrayer =
document.getElementById("egyptPrayer");

const meccaPrayer =
document.getElementById("meccaPrayer");

const pakistanPrayer =
document.getElementById("pakistanPrayer");

/* سيتم استخدامه لاحقًا */
let egyptTimes = null;

/*=====================================
        FETCH PRAYERS
=====================================*/

async function loadPrayerTimes(city,country,element){

    try{

        const url =
`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=5`;

        const response = await fetch(url);

        if(!response.ok)
            throw new Error("Network Error");

        const json = await response.json();

        const times = json.data.timings;

        if(city==="Cairo"){

            egyptTimes = times;

        }

        element.innerHTML=`

        <div class="prayer-row">
            🌅 الفجر
            <span>${times.Fajr}</span>
        </div>

        <div class="prayer-row">
            🌄 الشروق
            <span>${times.Sunrise}</span>
        </div>

        <div class="prayer-row">
            ☀️ الظهر
            <span>${times.Dhuhr}</span>
        </div>

        <div class="prayer-row">
            🌤 العصر
            <span>${times.Asr}</span>
        </div>

        <div class="prayer-row">
            🌇 المغرب
            <span>${times.Maghrib}</span>
        </div>

        <div class="prayer-row">
            🌙 العشاء
            <span>${times.Isha}</span>
        </div>

        `;

    }

    catch(error){

        console.error(error);

        element.innerHTML=`

        <div class="error">

        ❌

        تعذر تحميل المواقيت

        </div>

        `;

    }

}

/*=====================================
        LOAD ALL
=====================================*/

async function loadAllPrayerTimes(){

    await Promise.all([

        loadPrayerTimes(
            "Cairo",
            "Egypt",
            egyptPrayer
        ),

        loadPrayerTimes(
            "Makkah",
            "Saudi Arabia",
            meccaPrayer
        ),

        loadPrayerTimes(
            "Islamabad",
            "Pakistan",
            pakistanPrayer
        )

    ]);

}

loadAllPrayerTimes();

/*=====================================
        AUTO REFRESH

        يحدث كل ساعة
=====================================*/

setInterval(

    loadAllPrayerTimes,

    1000*60*60

);

/*=====================================
        HELPER

        تحويل HH:MM إلى دقائق
=====================================*/

function timeToMinutes(time){

    const parts = time.split(":");

    return Number(parts[0])*60 +

           Number(parts[1]);

}

/*=====================================
        HELPER

        الوقت الحالي بالدقائق
=====================================*/

function currentMinutes(){

    const now = new Date();

    return now.getHours()*60+

           now.getMinutes();

};

/*==================================================
                ZKR.JS PART 3
==================================================*/

const nextPrayerName =
document.getElementById("nextPrayerName");

const countdown =
document.getElementById("countdown");

/*=====================================
        NEXT PRAYER
=====================================*/

function updateNextPrayer(){

    if(!egyptTimes) return;

    const prayers=[

        ["الفجر",egyptTimes.Fajr],

        ["الظهر",egyptTimes.Dhuhr],

        ["العصر",egyptTimes.Asr],

        ["المغرب",egyptTimes.Maghrib],

        ["العشاء",egyptTimes.Isha]

    ];

    const now=new Date();

    const current=

        now.getHours()*60+

        now.getMinutes();

    let next=null;

    for(const prayer of prayers){

        if(timeToMinutes(prayer[1])>current){

            next=prayer;

            break;

        }

    }

    if(!next){

        next=["الفجر",egyptTimes.Fajr];

    }

    nextPrayerName.textContent=next[0];

    updateCountdown(next[1]);

}

/*=====================================
        COUNTDOWN
=====================================*/

function updateCountdown(time){

    const now=new Date();

    const target=new Date();

    const parts=time.split(":");

    target.setHours(

        Number(parts[0]),

        Number(parts[1]),

        0,

        0

    );

    if(target<now){

        target.setDate(

            target.getDate()+1

        );

    }

    const diff=target-now;

    const hours=Math.floor(

        diff/1000/60/60

    );

    const minutes=Math.floor(

        (diff/1000/60)%60

    );

    const seconds=Math.floor(

        (diff/1000)%60

    );

    countdown.textContent=

`${String(hours).padStart(2,"0")}:`+

`${String(minutes).padStart(2,"0")}:`+

`${String(seconds).padStart(2,"0")}`;

}

/*=====================================
        UPDATE EVERY SECOND
=====================================*/

setInterval(()=>{

    updateNextPrayer();

},1000);

/*=====================================
        BACKGROUND BY TIME
=====================================*/

function updateTheme(){

    const hour=new Date().getHours();

    if(hour>=4&&hour<6){

        document.body.style.background=

"linear-gradient(135deg,#1e3a8a,#60a5fa,#bfdbfe)";

    }

    else if(hour>=6&&hour<17){

        document.body.style.background=

"linear-gradient(135deg,#0f172a,#1e40af,#2563eb)";

    }

    else if(hour>=17&&hour<19){

        document.body.style.background=

"linear-gradient(135deg,#7c2d12,#ea580c,#fdba74)";

    }

    else{

        document.body.style.background=

"linear-gradient(135deg,#020617,#0f172a,#1e293b)";

    }

}

updateTheme();

setInterval(updateTheme,60000);

/*=====================================
        DAILY VERSE
=====================================*/

const verses=[

"﴿ ألا بذكر الله تطمئن القلوب ﴾",

"﴿ فاذكروني أذكركم ﴾",

"﴿ واستعينوا بالصبر والصلاة ﴾",

"﴿ إن الله مع الصابرين ﴾",

"﴿ وربك فكبر ﴾",

"﴿ وما توفيقي إلا بالله ﴾",

"﴿ إن مع العسر يسرا ﴾",

"﴿ وقل رب زدني علما ﴾"

];

const verseElement=

document.getElementById("dailyVerse");

if(verseElement){

    const day=new Date().getDate();

    verseElement.textContent=

    verses[day%verses.length];

}

/*=====================================
        DAILY HADITH
=====================================*/

const hadiths=[

"خيركم من تعلم القرآن وعلمه.",

"الدال على الخير كفاعله.",

"تبسمك في وجه أخيك صدقة.",

"يسروا ولا تعسروا.",

"إن الله يحب إذا عمل أحدكم عملاً أن يتقنه.",

"الكلمة الطيبة صدقة.",

"المؤمن للمؤمن كالبنيان يشد بعضه بعضا.",

"أحب الأعمال إلى الله أدومها وإن قل."

];

const hadithElement=

document.getElementById("dailyHadith");

if(hadithElement){

    const day=new Date().getDate();

    hadithElement.textContent=

    hadiths[day%hadiths.length]

}
/*==================================================
                ZKR.JS PART 4
==================================================*/

/*=====================================
        RIPPLE EFFECT
=====================================*/

buttons.forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        const size=Math.max(

            button.clientWidth,

            button.clientHeight

        );

        ripple.style.width=size+"px";
        ripple.style.height=size+"px";

        const rect=button.getBoundingClientRect();

        ripple.style.left=

        e.clientX-rect.left-size/2+"px";

        ripple.style.top=

        e.clientY-rect.top-size/2+"px";

        ripple.className="ripple";

        button.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

/*=====================================
        SAVE LAST PAGE
=====================================*/

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        const page=

        button.getAttribute("onclick");

        localStorage.setItem(

            "lastVisited",

            page

        );

    });

});

/*=====================================
        PAGE LOAD ANIMATION
=====================================*/

window.addEventListener("load",()=>{

    document.body.animate(

    [

        {

            opacity:0,

            transform:"translateY(20px)"

        },

        {

            opacity:1,

            transform:"translateY(0)"

        }

    ],

    {

        duration:800,

        easing:"ease-out"

    });

});

/*=====================================
        REFRESH PRAYERS

        Every Midnight
=====================================*/

function millisecondsUntilTomorrow(){

    const now=new Date();

    const tomorrow=new Date(

        now.getFullYear(),

        now.getMonth(),

        now.getDate()+1,

        0,0,5

    );

    return tomorrow-now;

}

setTimeout(()=>{

    loadAllPrayerTimes();

    setInterval(

        loadAllPrayerTimes,

        86400000

    );

},millisecondsUntilTomorrow());

/*=====================================
        CONNECTION STATUS
=====================================*/

window.addEventListener("offline",()=>{

    console.warn(

        "Internet disconnected."

    );

});

window.addEventListener("online",()=>{

    loadAllPrayerTimes();

});

/*=====================================
        PERFORMANCE
=====================================*/

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            console.log(

                "Page Hidden"

            );

        }else{

            updateClock();

            updateDate();

            updateHijri();

            updateTheme();

            updateNextPrayer();

        }

});

/*=====================================
        SMALL BUTTON SCALE
=====================================*/

buttons.forEach(button=>{

    button.addEventListener(

        "mouseenter",

        ()=>{

            button.animate([

                {

                    transform:"scale(1)"

                },

                {

                    transform:"scale(1.04)"

                }

            ],{

                duration:180,

                fill:"forwards"

            });

        });

});

/*=====================================
        CONSOLE MESSAGE
=====================================*/

console.log(

`🕌
ZKR Website

Version 2.0

Developed Successfully

`);
