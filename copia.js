/*function manejoMejoras(nuevaPos, mejorasActuales){
    if(colisionaPos(nuevaPos, mejorasActuales) == null){
        intentos = 0; 
        tipodeMejoraRand = mejoraRand();
        nivelMejora = 1;
        nuevaPosibleImagen = [[nuevaPos[0], nuevaPos[1]], tipodeMejoraRand, nivelMejora];
        while( ( colisionaPosImg(nuevaPosibleImagen, mejorasActuales) != null ) && intentos < 5 && (colisionaPosImgWall(nuevaPosibleImagen))){
            tipodeMejoraRand = mejorasLista[Math.floor(Math.random()*mejorasLista.length)];
            nuevaPosibleImagen = [[nuevaPos[0], nuevaPos[1]], tipodeMejoraRand, nivelMejora];
            intentos += 1; 
        }
        if( ( colisionaPosImg(nuevaPosibleImagen, mejorasActuales) != null ) ){
            indexDeColision = colisionaPosImg(nuevaPosibleImagen, mejorasActuales);
            //subir el nivel de evolucion de la mejora 
            if(indexDeColision != null){
                mejorasActuales[indexDeColision][2] +=1;
            }
            return mejorasActuales;
        }
        else if( colisionaPosImgWall(nuevaPosibleImagen)){
            return mejorasActuales;
        }
        else if( colisionaPosImg(nuevaPosibleImagen, mejorasActuales) == null){
            mejorasActuales.splice(0,0,nuevaPosibleImagen);
            return mejorasActuales;
        }
    }
    if( colisionaPos(nuevaPos, mejorasActuales) != null ){
        indexDeColision = colisionaPos(nuevaPos, mejorasActuales);
        //subir el nivel de evolucion de la mejora 
        mejorasActuales[indexDeColision][2] +=1; 
        return mejorasActuales;
    }
}

function colisionaPosImgWall(nuevaPosibleImagen){
    img = asignarImagenMejora(nuevaPosibleImagen);
    return ( ( ( nuevaPosibleImagen[0][0] + img.width ) > baseCanvas.width ) || ( ( nuevaPosibleImagen[0][1] + img.height ) > baseCanvas.height * 0.9 )  );
}

function colisionaPos(nuevaPos, mejorasActuales){
    for(var i = 0; i < mejorasActuales.length; i++){
        img = asignarImagenMejora(mejorasActuales[i]);
        mejoraActualX = mejorasActuales[i][0][0];
        mejoraActualY = mejorasActuales[i][0][1];
        colisionHorizontal = ( nuevaPos[0] > mejoraActualX ) && ( nuevaPos[0] < mejoraActualX + img.width );
        colisionVertical = ( nuevaPos[1] > mejoraActualY ) && ( nuevaPos[1] < mejoraActualY + img.height );
        if(colisionHorizontal && colisionVertical){
            return i;
        }
    }
    return null;
}

function colisionaPosImg(nuevaPosImg, mejorasActuales){
    imgNueva = asignarImagenMejora(nuevaPosImg);
    mejoraNuevaX = nuevaPosImg[0][0];
    mejoraNuevaXMasImgWidht = mejoraNuevaX + imgNueva.width;
    mejoraNuevaY = nuevaPosImg[0][1];
    mejoraNuevaYMasImgHeight = mejoraNuevaY + imgNueva.height;
    for(var i = 0; i < mejorasActuales.length; i++){
        imgAct = asignarImagenMejora(mejorasActuales[i]);
        mejoraActualX = mejorasActuales[i][0][0];
        mejoraActualY = mejorasActuales[i][0][1];
        if( (imgAct.width >= imgNueva.width) || (imgAct.height >= imgNueva.height) ){
            colisionHorizontal = ( ( mejoraNuevaX > mejoraActualX ) && ( mejoraNuevaX < mejoraActualX + imgAct.width ) ) || ( ( mejoraNuevaXMasImgWidht > mejoraActualX ) && ( mejoraNuevaXMasImgWidht < mejoraActualX + imgAct.width ) );
            colisionVertical = ( ( mejoraNuevaY > mejoraActualY ) && ( mejoraNuevaY< mejoraActualY + imgAct.height ) ) || ( ( mejoraNuevaYMasImgHeight > mejoraActualY ) && ( mejoraNuevaYMasImgHeight < mejoraActualY + imgAct.height ) );
            
        }
        else{
            colisionHorizontal = ( ( mejoraActualX > mejoraNuevaX ) && ( mejoraActualX < mejoraNuevaXMasImgWidht ) ) || ( ( mejoraActualX + imgAct.width > mejoraActualX ) && ( mejoraActualX + imgAct.width < mejoraNuevaXMasImgWidht ) );
            colisionHorizontal = ( ( mejoraActualY > mejoraNuevaY ) && ( mejoraActualY < mejoraNuevaYMasImgHeight ) ) || ( ( mejoraActualY + imgAct.height > mejoraActualY ) && ( mejoraActualY + imgAct.height < mejoraNuevaXMasImgWidht ) );
        }
        if(colisionHorizontal && colisionVertical){
            return i;
        }
    }
    return null;
}



/*function fondodraw(){
    var canvasWidth = baseCanvas.width;
    var canvasHeight = baseCanvas.height;
    
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,baseCanvas.width, baseCanvas.height);
    
    var imgHeight = cubitoImg.height;
    var imgWidth = cubitoImg.width;
    
    var boxVertOffset = 8;
    var boxHorOffset = boxVertOffset*horVerPerspRel;
    //print vertical
    var rowVertOffset = 100;
    //Padding vertical de los edificios (separacion del top de la pantalla)
    var edifVertPaddIzq = 100;
    var edifVertPaddDer = ( (canvasWidth / horVerPerspRel) + edifVertPaddIzq );
    var edifVerPaddBot = 25; 
    
    var rowNum = Math.floor((canvasHeight - imgWidth - edifVertPaddDer)/rowVertOffset) + 1;    
    basesDraw(canvasHeight,canvasWidth, edifVertPaddDer, edifVertPaddIzq, imgHeight, imgWidth, rowNum, edifVerPaddBot);
    
    for(var i=0; i < rowNum; i++){
        for(var j=0; (j*boxHorOffset + imgWidth< canvasWidth); j++){
            ctx.drawImage(cubitoImg, j*boxHorOffset+6, i*rowVertOffset + j*boxVertOffset + edifVertPaddIzq);
        }
    }
}

function basesDraw(canvasHeight, canvasWidth, edifVertPaddDer, edifVertPaddIzq, imgHeight, imgWidth, rowNum, edifVerPaddBot){
    //Base Macri
    ctx.beginPath(); 
    ctx.moveTo((edifVertPaddIzq - imgHeight/2)*horDeepPerspRel, 0 );
    ctx.lineTo(canvasWidth,canvasWidth /horVerPerspRel);
    ctx.lineTo(canvasWidth, edifVertPaddDer-imgHeight/2);
    ctx.lineTo(0, edifVertPaddIzq - imgHeight/2);
    ctx.lineTo((edifVertPaddIzq-imgHeight/2)*horDeepPerspRel,0);
    ctx.fillStyle = "#009900";
    ctx.fill();
    ctx.closePath();
    
    //Pared de la base de Cristina
    ctx.beginPath();
    ctx.moveTo(0, edifVertPaddIzq-imgHeight/2); 
    ctx.lineTo(canvasWidth, edifVertPaddDer-imgHeight/2);
    ctx.lineTo(canvasWidth, edifVertPaddDer+imgHeight/2); 
    ctx.lineTo(0, edifVertPaddIzq+imgHeight/2);
    ctx.fillStyle = "#404040"; 
    ctx.fill(); 
    ctx.closePath();

    //Base Cris
    inicioBaseCris = edifVertPaddIzq + rowNum*imgHeight + edifVerPaddBot;
    ctx.beginPath(); 
    ctx.moveTo(0,edifVertPaddIzq + rowNum*imgHeight + edifVerPaddBot);
    ctx.lineTo(canvasWidth, canvasWidth / horVerPerspRel + edifVertPaddIzq + rowNum*imgHeight + edifVerPaddBot / 2);
    ctx.lineTo(canvasWidth, canvasHeight); 
    ctx.lineTo(0, canvasHeight); 
    ctx.lineTo(0,edifVertPaddIzq + rowNum*imgHeight);
    ctx.fillStyle = "#009900";
    ctx.fill(); 
    ctx.closePath();
    return 0;
}
*/

/*function drawVida(vida){
    for(var i= 0; i < vida; i++){
        ctx.drawImage(dedosVida, 20 + dedosVida.width*i, 0);
    }
}*/

/*
function esperaRondaMode(){
    if(contadorPreRonda < esperaPreRonda){
        contadorPreRonda += 1;
        fondodraw(); 
        ctx.font = "2em Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center"; 
        ctx.fillText("RONDA " + rondasGanadas + " GANADA!", (baseCanvas.width / 2) , (baseCanvas.height / 2));
        drawCristi(mouseXPos);
        requestAnimationFrame(esperaRondaMode);
    }
    else if(contadorPreRonda >= esperaPreRonda){
        contadorPreRonda = 0; 
        rondaModeOn = true;
        esperaRondaModeOn = false;
        requestAnimationFrame(main); 
    }
}
*/

/*function looseMode(){
    ctx.fillStyle = "red"; 
    fontSize = 20;
    ctx.font = fontSize + "px Console";
    ctx.textAlign = "center";
    if(looseModeOn){
        ctx.fillText("Has perdido!", baseCanvas.width /2, baseCanvas.height / 2);
        ctx.fillText("Lograste evitar " + matadosTotales + " ajustes", baseCanvas.width / 2, baseCanvas.height / 2 + fontSize);
        ctx.fillText("Devolviste al pueblo $" + dineroSalvado, baseCanvas.width / 2, baseCanvas.height / 2 + fontSize * 2);
        ctx.fillText("Click o touch para continuar", baseCanvas.width/2, baseCanvas.height - 40);
        requestAnimationFrame(looseMode);
    }
    else if(!looseModeOn){
        looseModeOn = false; 
        reinicio();
    }
}*/

/*function reinicio(){
    tiros = [];
    ajustes = []; 
    ajustesParaDestroy = [];
    mejoras = [];
    matadosTotales = 0; 
    vida = vidaOriginal; 
    dineroSalvado = 0;
    gameModeOn = true; 
    requestAnimationFrame(main);
}*/

//declarando las relaciones de perspectiva
/*var horVerPerspRel = (7.33)/(1);
var horDeepPerspRel = (0.21)/(1);
var inicioBaseCris = 0;
*/

/*
var esperaRondaModeOn = false;
var esperaPreRonda = 400;
var contadorPreRonda = 0; 
var rondasGanadas = 0; 
*/


// DENTRO DE ASIGNAR IMAGEN MEJORAS 
/*else if(tipodeMejora == "mejoraPickUpAzul"){
        img = mejoraPickupAzul;
    }
    else if(tipodeMejora == "mejoraPickUpRoja"){
        img = mejoraPickupRoja;
    }
    else if(tipodeMejora == "mejoraPickUpVerde"){
        img = mejoraPickupVerde;
    }*/

/*function colisionaconOtros(tipodeMejora, nivel, proximaPunta, listadePuntas){
    console.log("---------------");
    console.log("PP " + proximaPunta);
    var imgMejora = asignarImagenMejora(tipodeMejora, nivel); 
    var limiteMejoraXIzquierda = proximaPunta[0]; 
    var limiteMejoraXDerecha = proximaPunta[0] + img.width;
    var limiteMejoraYSuperior = proximaPunta[1]; 
    var limiteMejoraYInferior = proximaPunta[1] + img.height;
    for(var i = 0; i < listadePuntas.length; i++){
        var puntaEnEvaluacion = listadePuntas[i];
        var colisionHorizontal = ( ( limiteMejoraXIzquierda < puntaEnEvaluacion[0] ) && ( puntaEnEvaluacion[0] < limiteMejoraXDerecha ) ); 
        var colisionVertical = ( ( limiteMejoraYSuperior < puntaEnEvaluacion[0] ) && ( puntaEnEvaluacion[1] < limiteMejoraYInferior ) );
        if(colisionHorizontal && colisionVertical){
            console.log("VE COLISION " + puntaEnEvaluacion);
            return true;
        }
    }
    console.log("NO VE COLISION");
    return false; 
}*/
/*function modificarPuntasDisponibles(mejora, listadePuntas){
    var imgMejora = asignarImagenMejora(mejora[2], mejora[3]);
    var nuevaspuntas = [[mejora[0] + imgMejora.width, mejora[1]], [mejora[0], mejora[1] + imgMejora.height], [mejora[0] + imgMejora.width, mejora[1] + imgMejora.height]] ;
    var puntaAEliminar = [mejora[0], mejora[1]];
    for(var i = 0; i < listadePuntas.length; i++){
        var puntaenEv = listadePuntas[i];
        if( (puntaenEv[0] == puntaAEliminar[0]) && (puntaenEv[1] == puntaAEliminar[1]) ){
            puntasNoUsables.splice(0,0,listadePuntas[i]);
            listadePuntas.splice(i, 1);
            break;
        }
    }
    var estaPresente = false;
    for(var i = 0; i < nuevaspuntas.length; i++){
        for(var j = 0; j < puntasNoUsables.length; j++){
            if( (nuevaspuntas[i][0] == puntasNoUsables[j][0]) && (nuevaspuntas[i][1] == puntasNoUsables[j][1]) ){
                estaPresente = true;
                break;
            }
        }
        if(!estaPresente){
            listadePuntas.splice(0,0,nuevaspuntas[i]);
        }
        estaPresente = false;
    }
    return listadePuntas;
}*/
 /*arrayManejoMejoras = manejoMejoras(mejoras,listadePuntas);
        mejoras = arrayManejoMejoras[0]; 
        listadePuntas = arrayManejoMejoras[1];*/
/*var mejoras = [];
var listadePuntas = [[0,0],[0,baseCanvas.height],[baseCanvas.width,0],[baseCanvas.width, baseCanvas.height]];
var puntasNoUsables = [];*/

/*function loadDestroySprite(){
    var lista = [];
    for(var i=1; i < 31; i++){
        lista.splice(i, 0, loadImg("imagenes/exploSprite/explo" + i.toString() + ".png")); 
    }
    return lista; 
}*/

/*if(mejoras == 0){
            mejoras.splice(0,0,nuevaMejora(puntasDisponibles));
            puntasDisponibles = modificarPuntasDisponibles(mejoras[0], puntasDisponibles);
            
            mensajeCrecimiento = asignarMensaje(mejoras[0][2], "crecimiento");
            mensaje = mensajeCrecimiento;
        }
        else{
            var maxeo = false;
            for(var i = 0; i < mejoras.length; i++){
                if(!maxLevel(mejoras[i])){
                    mejoras[i][3] += 1;
                    maxeo = true;
                    break;
                }
            }
            if(!maxeo){
                mejoras.splice(0,0,nuevaMejora(puntasDisponibles));
                if(mejoras[0] == null){
                    mejoras.splice(0,1);
                }
                else{
                    mensajeCrecimiento = asignarMensaje(mejoras[0][2], "crecimiento");
                    mensaje = mensajeCrecimiento;
                    mensajeCount = 0;
                }
                puntasDisponibles = modificarPuntasDisponibles(mejoras[0], puntasDisponibles);
            }
        }*/

/*function colisionaConPared(tipodeMejora, proximaPunta, nivel){
    var imgMejora = asignarImagenMejora(tipodeMejora, nivel);
    if( (proximaPunta[0] + imgMejora.width > baseCanvas.width ) || ( proximaPunta[1] + imgMejora.height > baseCanvas.height * 0.9 ) ){
        return true; 
    }
    else{
        return false; 
    }
}*/

/*var maxeo = false;
        var intentos = 0;
        while(!maxeo && intentos < 50){
            var mejoraRandIndex = Math.floor(Math.random()*mejoras.length);
            if(!maxLevel(mejoras[mejoraRandIndex])){
                mejoras[mejoraRandIndex][3] += 1;
                maxeo = true;
                if(mejoras[mejoraRandIndex][3] == 2){
                    mensajeCrecimiento = asignarMensaje(mejoras[mejoraRandIndex][2], "crecimiento");
                    mensaje = mensajeCrecimiento;
                    mensajeCount = 0;
                }
            }
            intentos += 1;
        }*/

/*luzAjuste = loadImg("imagenes/rayo.png");
    gasAjuste = loadImg("imagenes/fueguito2.png");
    buitreAjuste = loadImg("imagenes/buitreAjuste.png");
    policiaAjuste = loadImg("imagenes/policia.png");*/

/*function asignarImagenAjuste(ruta){
    if(ruta == "luzAjuste"){
        img = luzAjuste; 
    }
    else if(ruta == "gasAjuste"){
        img = gasAjuste;
    }
    else if(ruta == "buitreAjuste"){
        img = buitreAjuste; 
    }
    else if(ruta == "policiaAjuste"){
        img = policiaAjuste;
    }
    return img
}*/