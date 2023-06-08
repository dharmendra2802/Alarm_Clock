// global data holders

let comingAlarms;
let counter = 0 ;
if(localStorage.getItem('comingAlarms') == null)
{
    comingAlarms = [{
        hour:-1,
        min:-1,
        apm:'na'
    }];
}else
{
    
    comingAlarms = JSON.parse(localStorage.getItem('comingAlarms'));
    // console.log(counter)
    for(let i=0;i<comingAlarms.length;i++)
    {
        // console.log(i+" "+counter+comingAlarms.length)
        if(comingAlarms[counter]==null)
        {
            comingAlarms.splice(i,1);
        }
        // console.log(counter+ " "+ comingAlarms[counter]);
        showAddedAlarm();
        counter++;

    }    
    deleteAlarm();
    counter--;
}


// to update localStorage 
window.addEventListener('beforeunload', function() {
    // Store the updated variable in localStorage
    localStorage.setItem('comingAlarms', JSON.stringify(comingAlarms));

});


// to count available alarms
// to keep track of alrm check
let isAlarmTriggered = false;


// js code for working of clock means showing time


// HTML elements
let hour = document.getElementById('hour-cont');
let min = document.getElementById('min-cont');
let sec = document.getElementById('sec-cont');
let apm = document.getElementById('apm');
let prevMin = 0;
// Function to update the clock display
function startClock() {
    // Get current time
    let time = new Date();
    
    // Check if it's AM or PM
    let isAM = true;
    if (time.getHours() > 11) {
        isAM = false;
    }    

    if (isAM) {
        hour.innerHTML = time.getHours();
        apm.innerHTML = 'AM';
    } else {
        hour.innerHTML = (time.getHours()== 12) ? '12': time.getHours()-12;
        apm.innerHTML = 'PM';
    }    

    // Add leading zeros for minutes and seconds
    min.innerHTML = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    sec.innerHTML = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    
    if( !isAlarmTriggered && prevMin!=time.getMinutes()) // if there is atleast one set alrm and it is not being triggered yet
    {
        prevMin=time.getMinutes();
        // console.log("checked");
        alarmCheck();
    }

}        


// Update the clock display every second and check the alarm
setInterval(startClock, 1000);

// end of this


// this function will start the second job of the app
//  it will be triggered only when atleast one alarm is set


document.getElementById('add-alm-icon').addEventListener('click', unHide);

// function to unhide set alarm block
function unHide() {
    const addAlrm = document.getElementById('set-alrm-block');
    addAlrm.classList.toggle('hide');
}

// this is the add alrm block and used to add alarm

document.getElementById('set-alm-bttn').addEventListener('click', function() {
    
    const hour = document.getElementById('hour-value');
    const min = document.getElementById('min-value');
    const apm = document.getElementById('apm-value').value;
    // data check
    if(hour.value.length>2 || min.value.length>2 || hour.value>12 || min.value>59 ||
        hour.value.length<1 || min.value.length<1)
    {
            hour.value = ' ';
            min.value = ' ';
            alert("Please enter valid time")
            return;
    }


    //data check end
    hour.value = hour.value.length<2 ? '0'+hour.value:hour.value;
    min.value = min.value.length<2 ? '0'+min.value:min.value;
    counter++;
    
    comingAlarms[counter] = {
        hour:hour.value,
        min:min.value,
        apm
    };    
    unHide();
    showAddedAlarm();
    
// console.log(counter)
deleteAlarm();

hour.value = ' ';
min.value = ' ';

});

function deleteAlarm()
{

// deleting the child when delete icon is clicked
    if(counter>=0)
    {
        const delete_bttn = document.querySelectorAll('.delete_icon');
        delete_bttn.forEach((bttn) => {
            bttn.addEventListener('click', function() {
                const parent = bttn.parentElement.parentElement;
                const parent_ID = parent.id;
                parent.remove();

                comingAlarms.splice(parent_ID,1);
                
                counter--;
            });
        });
    }

}


// check alarm
function alarmCheck()
{
    
    const time = new Date();
    let hour = time.getHours();
    const min = time.getMinutes();
    const apm = hour>11 ? 'PM' : 'AM';
    hour = hour>12?hour-12:hour;
    
    for(let i = 0 ;i<=counter;i++)
    {
        console.log(comingAlarms[i].hour+" "+comingAlarms[i].min+" "+comingAlarms[i].apm);
        console.log("xxx"+hour+" "+min+" "+apm);
        
        // console.log(apm)
        if(comingAlarms[i].hour==hour && comingAlarms[i].apm==apm)
        {
            console.log(apm)
            if(comingAlarms[i].min==min)
                {
                    console.log("d");
                    isAlarmTriggered=true;
                    buzzer(1);
                }
            }
    }
}

// function to create a div for the added alrm

function showAddedAlarm() {
    var upcomingBlock = document.createElement("div");
    upcomingBlock.className = "upcoming-block";
    upcomingBlock.id = "child_"+counter;
    var childDiv1 = document.createElement("div");
    childDiv1.className = "child";

    var alarmIcon = document.createElement("img");
    alarmIcon.src = "img/alarm-clock.png";
    alarmIcon.alt = "alarm-clock";
    alarmIcon.className = "icon";

    var timeParagraph = document.createElement("p");
    timeParagraph.id = "time";
    // console.log(counter)
    timeParagraph.innerHTML = `${comingAlarms[counter].hour}:${comingAlarms[counter].min} ${comingAlarms[counter].apm}`;

    childDiv1.appendChild(alarmIcon);
    childDiv1.appendChild(timeParagraph);

    var childDiv2 = document.createElement("div");
    childDiv2.className = "child";

    var deleteIcon = document.createElement("img");
    deleteIcon.src = "img/delete-b.png";
    deleteIcon.alt = "delete almr";
    deleteIcon.className = "icon delete_icon";

    // childDiv2.appendChild(toggleBlock);
    childDiv2.appendChild(deleteIcon);

    upcomingBlock.appendChild(childDiv1);
    upcomingBlock.appendChild(childDiv2);

    var container = document.getElementById("upcoming-cont");
    container.appendChild(upcomingBlock);
}




// buzzer function
function buzzer(y)
{
    const stop = document.getElementById('clock-out');
    const myAudio = document.getElementById('sound');
    if(y)
    {
        myAudio.play();
    }
    else
    {
        console.log("alert")
        myAudio.pause();
    }

    stop.addEventListener('click',stopBuzzer);
    document.body.classList.toggle('alert');
    stop.classList.toggle('animated-buzzer');
    
}

// buzzer stopper
function stopBuzzer()
{

    isAlarmTriggered=false;
    buzzer(0);
}


// dark mode

const mode = document.getElementById('mode')
mode.addEventListener('click',function()
{
    const body = document.querySelector(':root');

    const ball = document.getElementById('set');
    if(mode.classList.contains('dark-on'))
    {
        mode.classList.toggle('dark-on');   
        ball.classList.add('light');
        ball.classList.remove('dark')
        
        body.style.setProperty('--bg','#F8F8F8');
        body.style.setProperty('--outline','#212121');
        
        body.style.setProperty('--text','black');
        body.style.setProperty('--clock-body','black');
        
        body.style.setProperty('--block-bg','#E0E0E0');
        body.style.setProperty('--block-hover','#FFD54F');

        body.style.setProperty('--add-bg',' rgba(255, 193, 7,0.5) ');
        
    }else
    {       
        mode.classList.toggle('dark-on');   
        ball.classList.remove('light');
        ball.classList.add('dark')

        body.style.setProperty('--bg','#333333');
        body.style.setProperty('--outline','#FFFFFF');

        body.style.setProperty('--text','#FFFFFF');
        body.style.setProperty('--clock-body','#FFD700');

        body.style.setProperty('--block-bg','#555555');
        body.style.setProperty('--block-hover','#777777');

    }


})


document.getElementById('close').addEventListener('click',unHide);