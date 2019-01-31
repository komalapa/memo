var glField = [];
var selectedPictures = [];
var openedCellNumber1 = -1; //-1 - не выбрано, 0..размер поля - номер открытой ячейки
var openedCellNumber2 = -1; //-1 - не выбрано, 0..размер поля - номер открытой ячейки
var pairs = 0;
var tries = 0;
var set="";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createArray(halfSize) {
    var fieldArray =[];
    var ind = 0;
    for (var i = 0; i < halfSize; i++) {
            fieldArray[i]=[i,2];//0 - картинка закрыта 1 - картинка открыта открыта 2 - картинка угадана неактивна (2 так же используется для блокировки поля пока оно открыто)
            fieldArray[2*halfSize-1 -i]=[i,2];
        }
    return fieldArray;
    }

function selectPictures(numb, maxNumb){
    var numbsList=[]
    for(let i=0; i<maxNumb;i++){
        numbsList[i]=i;
    }
    numbsList=shuffleArray(numbsList);
    return numbsList.slice(0,numb);
}

function generateField(halfSize){
    
    pairs = halfSize;
    document.getElementById("pairs").innerHTML = `Pairs left: ${pairs}`;
    glField = createArray(halfSize);
    glField = shuffleArray(glField);
    selectedPictures = selectPictures(halfSize,19);
    for (let i=0; i<halfSize*2;i++){
        const divStr = `<div class = \"cell\" id= \"id${i}\"> <img src=\"drawable/${set}/${selectedPictures[glField[i][0]]}.png\" onclick = \"clickOnImg(${i})\"> </div>`
        $("#field").append(divStr);
    }
    
}


function closeCell(i){
  
    var image = jQuery(`div#id${i} img`);
    image.get(0).src="drawable/jacket.png";
    glField[i][1]= 0;
    
}
function openCell(i){
  
    var image = jQuery(`div#id${i} img`);
    image.get(0).src=`drawable/${set}/${selectedPictures[glField[i][0]]}.png`;
    glField[i][1]= 1;
}

function closeField(){
    for (let i=0; i<glField.length;i++){
        closeCell(i);
    }
}


function winner(){
    var field = jQuery(`div#field`);
    field.get(0).innerHTML=("<img id=\"win\" src=\"drawable/win.png\">");
    
}

function clickOnImg(i){
    
    if (glField[i][1] == 1){
        closeCell(i);
    } else if (glField[i][1] == 0){
        if (openedCellNumber1 == -1){
            openCell(i);
            openedCellNumber1 = i;
        } else if (openedCellNumber1 >= 0){
            if (openedCellNumber2<0){
                    openCell(i);
                    openedCellNumber2=i;
                    if (glField[i][0] == glField[openedCellNumber1][0]){
                        glField[i][1] = 2;
                        glField[openedCellNumber1][1] = 2;
                        openedCellNumber1 = -1; // помечаем что открытых ячеек нет
                        openedCellNumber2 = -1;
                        pairs --;
                        document.getElementById("pairs").innerHTML = `Pairs left: ${pairs}`;
                        if ( pairs <= 0){
                            winner();
                        }
                    }
                
            } else {//нажата третья. две закрыть новую открыть
                closeCell(openedCellNumber1);
                closeCell(openedCellNumber2);
                openedCellNumber1=i;
                openCell(i);
                openedCellNumber2 = -1
                
                tries++; //раз пришлось закрывать - засчитываем ошибку
                document.getElementById("errors").innerHTML = `Errors: ${tries}`;
            }
        }
        
    } else {
        console.log("2");
        return
    }
    
}
function start(){
    
    $("#field").html("");
    var fieldSize = $('input[name=size]:checked').val();
    set = $('input[name=picset]:checked').val(); //чистим поле
    
    pairs = fieldSize/2;//чистим ошибки и пары
    tries = 0;
    document.getElementById("pairs").innerHTML = `Pairs left: ${pairs}`;
    document.getElementById("errors").innerHTML = `Errors: ${tries}`;
    
    generateField(pairs);
    setTimeout(function(){
                closeField();
    }, 5000);//5 секунд до захлопывания
}
start();