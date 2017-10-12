function canvasSize(canvas){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var canvasAncho = 0; 
    var canvasAlto = 0; 
    if(detectmob()){
        canvasAncho = windowWidth; 
        canvasAlto = windowHeight; 
    }
    else{
        canvasAncho = windowWidth/2; 
        canvasAlto = windowHeight; 
    }    
    canvas.setAttribute("height", canvasAlto + "px");
    canvas.setAttribute("width", canvasAncho + "px");
}

function loadImg(ruta){
    var imag = new Image(); 
    imag.src = ruta;
    return imag;
}

function loadSound(rutas){
    var sound = new Audio(); 
    sound.src = rutas;
    if(rutas == "sonidos/construccionSound.m4a"){
        sound.loop = true;
    }
    return sound;
}

function loadMonedaSprite(){
    var lista = [];
    for(var i=1; i < 9; i++){
        lista.splice(i,0,loadImg("imagenes/monedas/moneda" + i.toString() + ".png"));
    }
    return lista;
}

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

function drawFondo(){
    ctx.fillStyle = "#b86f3c";
    ctx.fillRect(0,0,baseCanvas.width, baseCanvas.height *0.9);
    ctx.drawImage(congreso, 0,baseCanvas.height*0.9);
}

function drawCristi(xPos){
    var imgHeight = cristinaImg.height;
    var imgWidth = cristinaImg.width;
    if(cristiState === "shooting"){
        ctx.drawImage(cristinaShootImg, xPos, baseCanvas.height *0.95 - cristinaShootImg.height);
    }
    else{
        ctx.drawImage(cristinaImg, xPos, baseCanvas.height*0.95 - cristinaShootImg.height);
    }
}

function drawTiros(tiros){
    for(var i=0; i < tiros.length; i++){
        ctx.drawImage(solcito, tiros[i][0],tiros[i][1]);
    }
    
}

function mouseMoveHandler(e){
    var relativeX = e.clientX - baseCanvas.offsetLeft;
    if(relativeX > 0 && relativeX + cristinaImg.width < baseCanvas.width) {
        mouseXPos = relativeX;
    }
}

function mouseClickHandler(e){
    if(gameModeOn){
        cristiState = "shooting"; 
        tiros.splice(0, 0, [mouseXPos, baseCanvas.height*0.95 - cristinaShootImg.height]);
        relativeY = e.clientY - baseCanvas.offsetTop;
        if(relativeY > baseCanvas.height - pausa.height){
            if(mouseXPos > baseCanvas.width - pausa.width && mouseXPos < baseCanvas.width){
                pausaModeOn = true; 
                gameModeOn = false;
            }
        }
    }
    else if(comienzoModeOn){
        comienzoModeOn = false;
        instruModeOn = true;
    }
    else if(instruModeOn){
        instruModeOn = false; 
        gameModeOn = true;
    }
    else if(bonusModeOn){
        var relativeX = e.clientX - baseCanvas.offsetLeft; 
        var relativeY = e.clientY -baseCanvas.offsetTop;
        if(relativeY > baseCanvas.height/2 - bonusPueblo.height && relativeY < baseCanvas.height/2 + bonusPueblo.height){
            if((relativeX > bonusCompanero.width * 2) && (relativeX < bonusCompanero.width * 3)){
                aplicarBonus("companero");
                bonusModeOn = false; 
            }
            else if((relativeX > baseCanvas.width/2 - bonusPueblo.width/2) && (relativeX < baseCanvas.width/2 + bonusPueblo.width/2 )){
                aplicarBonus("pueblo");
                requestAnimationFrame(animPueblo);
            }
            else if((relativeX > baseCanvas.width - bonusRedistribucion.width * 3) && (relativeX < baseCanvas.width - bonusRedistribucion.width * 2)){
                aplicarBonus("redistribucion");
                bonusModeOn = false;
            }
        }
    }
    else if(pausaModeOn){
        pausaModeOn = false; 
        gameModeOn = true;
    }
    else if(presentacionModeOn){
        presentacionModeOn = false; 
        menuModeOn = true;
    }
    else if(menuModeOn){
        menuModeOn = false; 
        comienzoModeOn = true;
    }
    
}

function animPueblo(){
    if(contadorAnimPueblo < 200){
        for(var j = 0; j < listaPueblo.length; j++){
            listaPueblo[j][1] += 4;
        }
        for(var i = 0; i < 10; i++){
            randPos = Math.floor(Math.random()*baseCanvas.width);
            listaPueblo.splice(0,0, [randPos,0]);
        }
    }    
    else if(contadorAnimPueblo >= 250){
        contadorAnimPueblo = 0; 
        listaPueblo = []; 
        listaPuebloelim = [];
        bonusModeOn = false;
        return; 
    }
    drawFondo();
    drawMejoras(mejoras);
    for(var i = 0; i < listaPueblo.length; i++){
        ctx.drawImage(argentino, listaPueblo[i][0], listaPueblo[i][1]);
        if(i%5 == 0){
            ctx.fillStyle = "#ffffff"; 
            ctx.fillRect(listaPueblo[i][0], listaPueblo[i][1], 20,5);
        }
    }
    contadorAnimPueblo +=1; 
    requestAnimationFrame(animPueblo);

}

function aplicarBonus(tipodeBonus){
    if(tipodeBonus == "companero"){
        golpe += 2;
        legisladores.splice(0,0,nuevoLegislador());
        mensaje = "Sumas un nuevo compañero y mas fuerza contra los ajustes!";
        mensajeCount = 0;
    }
    if(tipodeBonus == "pueblo"){
        nuevoAjusteRate +=10;
        mensaje ="El ajuste no tiene cabida en este pueblo"; 
        mensajeCount = 0;
    }
    if(tipodeBonus == "redistribucion"){
        crecimientoLvl += 4;
        nuevoAjusteRate -=4;
        
        mensaje = "Repartes la riqueza! Tu nivel de crecimiento aumenta a " + (crecimientoLvl / 20) + "%";
        mensajeCount = 0;
    }
}

function nuevoLegislador(){
    eleccion = Math.floor((Math.random()*10)+1);
    if(eleccion % 2 == 0){
        return "mujer";
    }
    else{
        return "varon"; 
    }
}

function drawBonus(){
    ctx.fillStyle = "white";
    ctx.textAlign = "center"; 
    ctx.font = "23px Consolas"; 
    ctx.fillText("Momentos decisivos se acercan, ¿Qué debemos hacer compañerx?", baseCanvas.width/2, baseCanvas.height/2 - 2* bonusCompanero.height, baseCanvas.width-20);
    ctx.drawImage(bonusCompanero, bonusCompanero.width * 2,baseCanvas.height/2 - bonusCompanero.height);
    ctx.drawImage(bonusPueblo,baseCanvas.width/2 - bonusPueblo.width/2,baseCanvas.height/2 - bonusPueblo.height);    
    ctx.drawImage(bonusRedistribucion,baseCanvas.width - bonusRedistribucion.width * 3,baseCanvas.height/2 - bonusCompanero.height);
    ctx.font = "18px Consolas"; 
    ctx.textAlign = "left";     
    ctx.fillText("Sumar un compañero   Convocar el pueblo a la plaza   Redistribuir la riqueza", bonusCompanero.width * 2 - 20,baseCanvas.height/2 + 20, baseCanvas.width-20);
}


function manejoTiros(tiros){
    var newTiros = [];
    for(i = 0; i < tiros.length; i++){
        if(tiros[i][1] > 0){
            tiros[i][1] -= bulletSpeed;
            newTiros.splice(0,0,tiros[i]);
        }
    }
    return newTiros;
}

function manejoCristiState(){
    if(cristiState === "shooting"){
        shootAnimCount +=1; 
    }
    if(shootAnimCount === 10){
        cristiState = "rest"; 
        shootAnimCount = 0;
    }
}

function nuevaPuntaObjetivo(ajuste){
    var direcciones = [4,2,6];
    var direccion;
    var posicionX = ajuste[0][0];
    var posicionY = ajuste[0][1];
    var proxPosX; 
    var proxPosY;
    while(true){
        direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
        if(direccion == 4){
            proxPosX = posicionX - 60;
            proxPosY = posicionY;
        }
        if(direccion == 2){
            proxPosX = posicionX; 
            proxPosY = posicionY + 60;
        }
        if(direccion == 6){
            proxPosX = posicionX + 60; 
            proxPosY = posicionY;
        }
        for(var i = 0; i < puntasDisponibles.length; i++){
            if( (puntasDisponibles[i][0] == proxPosX) && (puntasDisponibles[i][1] == proxPosY) ){
                if(direccion == 2){
                    var prevPosX = posicionX - 60;
                    for(var j = 0; j < mejoras.length; j++){
                        if( (mejoras[j][0] == prevPosX) && (mejoras[j][1] == posicionY) ){
                            var hayPunta = true;
                            if(asignarAfectacion(mejoras[j][2]) == 1){
                                nuevaPunta = [proxPosX, proxPosY]; 
                                return nuevaPunta;
                            }
                        }
                    }
                    if(!hayPunta){
                        nuevaPunta = [proxPosX, proxPosY]; 
                        return nuevaPunta;
                    }
                }
                else{
                    nuevaPunta = [proxPosX, proxPosY];
                    return nuevaPunta;
                }
            }
        }
    }
}

function llegoaPunta(ajuste){
    var puntaObjetivo = ajuste[3];
    var posX = ajuste[0][0]; 
    var posY = ajuste[0][1]; 
    if( (Math.abs(posX - puntaObjetivo[0]) < (ajusteSpeed - 1)) && (Math.abs(posY - puntaObjetivo[1]) < (ajusteSpeed - 1)) ){
        return true;    
    }
    else{
        return false;
    }
}

function manejoAjustes(ajustes){
    var newAjustes = [];
    for(i = 0; i < ajustes.length; i++){
        if(ajustes[i][3] == 0){
            ajustes[i][3] = nuevaPuntaObjetivo(ajustes[i]);
        }
        else{
            if(llegoaPunta(ajustes[i])){
                ajustes[i][3] = [];
            }
            else{
                var objX = ajustes[i][3][0]; 
                var objY = ajustes[i][3][1]; 
                if( objX - ajustes[i][0][0] > 0 ){
                    ajustes[i][0][0] += ajusteSpeed;
                    ajustes[i][0][2] += ajusteSpeed;
                }
                else if( objX - ajustes[i][0][0] < 0){
                    ajustes[i][0][0] -= ajusteSpeed;
                    ajustes[i][0][2] -= ajusteSpeed;
                }
                else if( objY - ajustes[i][0][1] > 0 ){
                    ajustes[i][0][1] += ajusteSpeed;
                    ajustes[i][0][3] += ajusteSpeed;
                }
            }
        }
        if(nuevoAjusteCount % 6 == 0){
            if(ajustes[i][1] == 2){
                ajustes[i][1] = 1;
            }
            else{
                ajustes[i][1] = 2;
            }
        }
        newAjustes.splice(0,0,ajustes[i]);
    }
    return newAjustes;
}

function generacionAjustes(ajustes){
    if(nuevoAjusteCount >= nuevoAjusteRate){
        img = ceoSprite[0];
        var esPrincipio = false; 
        while(!esPrincipio){
            puntaRandIndex = Math.floor(Math.random()*puntasDisponibles.length);
            if(puntasDisponibles[puntaRandIndex][1] == 0){
                esPrincipio = true;
            }
        }
        ajusteXRandInitPos = puntasDisponibles[puntaRandIndex][0]
        ajusteYInitPos = puntasDisponibles[puntaRandIndex][1];
        ajustes.splice(0,0,[[ajusteXRandInitPos, ajusteYInitPos, ajusteXRandInitPos + img.width,  ajusteYInitPos + img.height], 1, vidaAjustes,[]]);
        nuevoAjusteCount = 0; 
        return ajustes;
    }
    if(nuevoAjusteCount < nuevoAjusteRate){
        nuevoAjusteCount +=1;
        return ajustes;
    }
}


function drawAjustes(ajustes){
    for(var i=0; i < ajustes.length; i++){
        if(ajustes[i][1] == 1){
            img = ceoSprite[0]; 
        }
        else if(ajustes[i][1] == 2){
            img = ceoSprite[1];
        }
        ctx.drawImage(img, ajustes[i][0][0],ajustes[i][0][1]-img.height);
        ctx.fillStyle = "green"; 
        ctx.fillRect(ajustes[i][0][0], ajustes[i][0][1] + 5, img.width*0.02*ajustes[i][2], 5);
    }
}

function colisionesfn(tiros, ajustes, ajustesParaDestroy){
    var matados = 0;
    for(var i=0; i < tiros.length; i++){
        tiroTopY = tiros[i][1];
        tiroXRange = [tiros[i][0], tiros[i][0] + solcito.width];
        for(var j = 0; j <ajustes.length; j++){
            ajusteBotY = ajustes[j][0][3];
            ajusteXRange = [ajustes[j][0][0], ajustes[j][0][2]]; 
            //si alguna de las dos puntas del tiro está entre las dos puntas del ajuste
            if( ( (ajusteXRange[0] <= tiroXRange[0]) && (tiroXRange[0] <= ajusteXRange[1]) ) || ( (ajusteXRange[0] <= tiroXRange[1]) && (tiroXRange[0] <= ajusteXRange[1]) )  ){
                if( ajusteBotY > tiroTopY){
                    ajustes[j][2]-= golpe;
                    tiros.splice(i, 1);
                        if(ajustes[j][2] <= 0){
                            matados += 1; 
                            ajustesParaDestroy.splice(0, 0, [ajustes[j][0][0], ajustes[j][0][1], 0, 0]);                 
                            ajustes.splice(j,1);
                        }
                }
            }
        }        
    }
    var golpes = 0; 
    for(var i=0; i < ajustes.length; i++){
        if(ajustes[i][0][3] >= maxHeightAjustes+30){
            golpes +=1;
            ajustes.splice(i,1);
        }
    }
    return [tiros, ajustes, ajustesParaDestroy, matados, golpes];
}

function drawAjustesDestroy(ajustesParaDestroy){
    for(var i = 0; i < ajustesParaDestroy.length; i++){
        var refExplo = ajustesParaDestroy[i][2];
        var refMoned = ajustesParaDestroy[i][3];
        //ctx.drawImage(ajusteDestroySprite[refExplo], ajustesParaDestroy[i][0], ajustesParaDestroy[i][1]);
        ctx.drawImage(monedaSprite[refMoned], ajustesParaDestroy[i][0]+refMoned*5, ajustesParaDestroy[i][1]+refMoned*5);
        ctx.drawImage(monedaSprite[refMoned], ajustesParaDestroy[i][0]+refMoned*(-5), ajustesParaDestroy[i][1]+refMoned*(5));
    }
}

function manejoAjustesParaDestroy(ajustesParaDestroy){
    for(var i = 0; i < ajustesParaDestroy.length; i++){
        if(ajustesParaDestroy[i][2] <= 29){
            ajustesParaDestroy[i][2] += 1;
            if(ajustesParaDestroy[i][3] == 7){
                ajustesParaDestroy[i][3] = 0;
            }
            else if(ajustesParaDestroy[i][3] < 7){
                ajustesParaDestroy[i][3] += 1;    
            }
        }
        if(ajustesParaDestroy[i][2] > 29){
            ajustesParaDestroy.splice(i, 1);
        }
    }
    return ajustesParaDestroy;         
}

function generarPuntasDisponibles(){
    var nuevaListadePuntas = [];
    var nuevaPunta = [];
    var entranHor = Math.floor((baseCanvas.width -60) / 60);
    var entranVer = Math.floor((baseCanvas.height*0.9 -60) / 60);
    for(var i = 0; i <= entranHor; i++){
        for(var j = 0; j <= entranVer; j++){
            nuevaPunta = [i*60, j*60];
            nuevaListadePuntas.splice(0,0,nuevaPunta);
        }
    }
    return nuevaListadePuntas;
}

function asignarAfectacion(tipodeMejora){
    var afectacion;
    if(tipodeMejora == "mejoraCasaHumilde1"){
        afectacion = 1;
    }
    if(tipodeMejora == "mejoraFabrica1"){
        afectacion = 2;
    }
    if(tipodeMejora == "mejoraParque1"){
        afectacion = 2;
    }
    if(tipodeMejora == "mejoraBarrio1"){
        afectacion = 2;
    }
    if(tipodeMejora == "mejoraBarrio2"){
        afectacion = 1;
    }
    if(tipodeMejora == "mejoraBarrio3"){
        afectacion = 2;
    }
    if(tipodeMejora == "mejoraEscuela1"){
        afectacion = 2;
    }
    if(tipodeMejora == "mejoraComercial1"){
        afectacion = 1;
    }
    if(tipodeMejora == "mejoraClub1"){
        afectacion = 2;
    }
    if(tipodeMejora == "mejoraCampo1"){
        afectacion = 2;
    }
    return afectacion;
}

function nuevaMejora(puntasDisponibles){
    var tipodeMejora = mejoraRand();
    var nivel = 1; 
    var afectacionHorizontal = asignarAfectacion(tipodeMejora);
    var posicion;
    if(afectacionHorizontal == 1){
        posicion = puntasDisponibles[Math.floor(Math.random()*puntasDisponibles.length)];
        var nuevaMejora = [posicion[0], posicion[1], tipodeMejora, nivel];
        return nuevaMejora;
    }
    else{
        var colisiona = true; 
        var intentos = 0;
        while(colisiona && intentos < 10){
            posicion = puntasDisponibles[Math.floor(Math.random()*puntasDisponibles.length)];
            for(var j = 0; j < puntasDisponibles.length; j++){
                if( (posicion[0] + 60 == puntasDisponibles[j][0]) && (posicion[1] == puntasDisponibles[j][1]) ){
                    colisiona = false; 
                    break;
                }
            }
            intentos +=1;
        }
        if(colisiona){
            return;
        }
        else{
            var nuevaMejora = [posicion[0], posicion[1], tipodeMejora, nivel];
            return nuevaMejora;
        }
    }
}

function modificarPuntasDisponibles(mejora, puntasDisponibles){
    var tipodeMejora = mejora[2]; 
    var nivelMejora = mejora[3]; 
    var imgMejora = asignarImagenMejora(tipodeMejora, nivelMejora);
    var puntasAfectadas = [[mejora[0],mejora[1]]];
    var afectacionHorizontal = asignarAfectacion(tipodeMejora);
    if(afectacionHorizontal > 1){
        for(var i = 1; i < afectacionHorizontal; i++){
            puntasAfectadas.splice(0,0,[mejora[0] + i * 60, mejora[1]]);
        }
    }
    for(var i = 0; i < puntasAfectadas.length; i++){
        for(var j= 0; j < puntasDisponibles.length; j++){
            if( (puntasAfectadas[i][0] == puntasDisponibles[j][0]) && (puntasAfectadas[i][1] == puntasDisponibles[j][1]) ){
                puntasDisponibles.splice(j,1);
                break;
            }
        }
    }
    return puntasDisponibles;
}

function detMaxHeightAjustes(){
    var maxHeight = 0; 
    for(var i = 0; i < puntasDisponibles.length; i++){
        if(puntasDisponibles[i][1] > maxHeight){
            maxHeight = puntasDisponibles[i][1];
        }
    }
    return maxHeight;
}

function maxLevel(mejora){
    var tipodeMejora = mejora[2];
    var nivelActual = mejora[3];
    var maxLevel = asignarMaxLevel(tipodeMejora);
    if(nivelActual == maxLevel){
        return true; 
    }
    else{
        return false; 
    }
}

function asignarMaxLevel(tipodeMejora){
    var maximoNivel; 
    if(tipodeMejora == "mejoraCasaHumilde1"){
        maximoNivel = 7;
    }
    if(tipodeMejora == "mejoraFabrica1"){
        maximoNivel = 6; 
    }
    if(tipodeMejora == "mejoraParque1"){
        maximoNivel = 6;
    }
    if(tipodeMejora == "mejoraBarrio1"){
        maximoNivel = 11;
    }
    if(tipodeMejora == "mejoraBarrio2"){
        maximoNivel = 7;
    }
    if(tipodeMejora == "mejoraBarrio3"){
        maximoNivel = 12;
    }
    if(tipodeMejora == "mejoraEscuela1"){
        maximoNivel = 6;
    }
    if(tipodeMejora == "mejoraComercial1"){
        maximoNivel = 9;
    }
    if(tipodeMejora == "mejoraClub1"){
        maximoNivel = 13;
    }
    if(tipodeMejora == "mejoraCampo1"){
        maximoNivel = 14;
    }
    return maximoNivel; 
}

function mejoraRand(){
    var nuevaMejoraDeLista = mejorasLista[Math.floor(Math.random()*mejorasLista.length)];
    return nuevaMejoraDeLista;
}

function asignarImagenMejora(tipodeMejora, niveldeMejora){
    var imagenAsociada;
    if(tipodeMejora == "mejoraCasaHumilde1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraCasaHumilde1Lvl1;    
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraCasaHumilde1Lvl2;    
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraCasaHumilde1Lvl3;    
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraCasaHumilde1Lvl4;    
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraCasaHumilde1Lvl5;    
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraCasaHumilde1Lvl6;    
        }
        if(niveldeMejora >= 7){
            imagenAsociada = mejoraCasaHumilde1Lvl7;    
        }
    }
    else if(tipodeMejora == "mejoraFabrica1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraFabrica1Lvl1; 
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraFabrica1Lvl2; 
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraFabrica1Lvl3; 
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraFabrica1Lvl4; 
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraFabrica1Lvl5; 
        }
        if(niveldeMejora >= 6){
            imagenAsociada = mejoraFabrica1Lvl6; 
        }
    }
    else if(tipodeMejora == "mejoraParque1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraParque1Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraParque1Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraParque1Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraParque1Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraParque1Lvl5;
        }
        if(niveldeMejora >= 6){
            imagenAsociada = mejoraParque1Lvl6;
        }
    }
    else if(tipodeMejora == "mejoraBarrio1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraBarrio1Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraBarrio1Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraBarrio1Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraBarrio1Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraBarrio1Lvl5;
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraBarrio1Lvl6;
        }
        if(niveldeMejora == 7){
            imagenAsociada = mejoraBarrio1Lvl7;
        }
        if(niveldeMejora == 8){
            imagenAsociada = mejoraBarrio1Lvl8;
        }
        if(niveldeMejora == 9){
            imagenAsociada = mejoraBarrio1Lvl9;
        }
        if(niveldeMejora == 10){
            imagenAsociada = mejoraBarrio1Lvl10;
        }
        if(niveldeMejora >= 11){
            imagenAsociada = mejoraBarrio1Lvl11;
        }
        
    }
    else if(tipodeMejora == "mejoraEscuela1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraEscuela1Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraEscuela1Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraEscuela1Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraEscuela1Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraEscuela1Lvl5;
        }
        if(niveldeMejora >= 6){
            imagenAsociada = mejoraEscuela1Lvl6;
        }
    }
    else if(tipodeMejora == "mejoraComercial1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraComercial1Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraComercial1Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraComercial1Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraComercial1Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraComercial1Lvl5;
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraComercial1Lvl6;
        }
        if(niveldeMejora == 7){
            imagenAsociada = mejoraComercial1Lvl7;
        }
        if(niveldeMejora == 8){
            imagenAsociada = mejoraComercial1Lvl8;
        }
        if(niveldeMejora >= 9){
            imagenAsociada = mejoraComercial1Lvl9;
        }
    }
    else if(tipodeMejora == "mejoraBarrio2"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraBarrio2Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraBarrio2Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraBarrio2Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraBarrio2Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraBarrio2Lvl5;
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraBarrio2Lvl6;
        }
        if(niveldeMejora >= 7){
            imagenAsociada = mejoraBarrio2Lvl7;
        }
    }
    else if(tipodeMejora == "mejoraBarrio3"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraBarrio3Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraBarrio3Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraBarrio3Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraBarrio3Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraBarrio3Lvl5;
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraBarrio3Lvl6;
        }
        if(niveldeMejora == 7){
            imagenAsociada = mejoraBarrio3Lvl7;
        }
        if(niveldeMejora == 8){
            imagenAsociada = mejoraBarrio3Lvl8;
        }
        if(niveldeMejora == 9){
            imagenAsociada = mejoraBarrio3Lvl9;
        }
        if(niveldeMejora == 10){
            imagenAsociada = mejoraBarrio3Lvl10;
        }
        if(niveldeMejora == 11){
            imagenAsociada = mejoraBarrio3Lvl11;
        }
        if(niveldeMejora >= 12){
            imagenAsociada = mejoraBarrio3Lvl12;
        }
    }
    else if(tipodeMejora == "mejoraClub1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraClub1Lvl1; 
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraClub1Lvl2; 
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraClub1Lvl3; 
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraClub1Lvl4; 
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraClub1Lvl5; 
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraClub1Lvl6; 
        }
        if(niveldeMejora == 7){
            imagenAsociada = mejoraClub1Lvl7; 
        }
        if(niveldeMejora == 8){
            imagenAsociada = mejoraClub1Lvl8; 
        }
        if(niveldeMejora == 9){
            imagenAsociada = mejoraClub1Lvl9; 
        }
        if(niveldeMejora == 10){
            imagenAsociada = mejoraClub1Lvl10; 
        }
        if(niveldeMejora == 11){
            imagenAsociada = mejoraClub1Lvl11; 
        }
        if(niveldeMejora == 12){
            imagenAsociada = mejoraClub1Lvl12; 
        }
        if(niveldeMejora >= 13){
            imagenAsociada = mejoraClub1Lvl13; 
        }
    }
    else if(tipodeMejora == "mejoraCampo1"){
        if(niveldeMejora == 1){
            imagenAsociada = mejoraCampo1Lvl1;
        }
        if(niveldeMejora == 2){
            imagenAsociada = mejoraCampo1Lvl2;
        }
        if(niveldeMejora == 3){
            imagenAsociada = mejoraCampo1Lvl3;
        }
        if(niveldeMejora == 4){
            imagenAsociada = mejoraCampo1Lvl4;
        }
        if(niveldeMejora == 5){
            imagenAsociada = mejoraCampo1Lvl5;
        }
        if(niveldeMejora == 6){
            imagenAsociada = mejoraCampo1Lvl6;
        }
        if(niveldeMejora == 7){
            imagenAsociada = mejoraCampo1Lvl7;
        }
        if(niveldeMejora == 8){
            imagenAsociada = mejoraCampo1Lvl8;
        }
        if(niveldeMejora == 9){
            imagenAsociada = mejoraCampo1Lvl9;
        }
        if(niveldeMejora == 10){
            imagenAsociada = mejoraCampo1Lvl10;
        }
        if(niveldeMejora == 11){
            imagenAsociada = mejoraCampo1Lvl11;
        }
        if(niveldeMejora == 12){
            imagenAsociada = mejoraCampo1Lvl12;
        }
        if(niveldeMejora == 13){
            imagenAsociada = mejoraCampo1Lvl13;
        }
        if(niveldeMejora >= 14){
            imagenAsociada = mejoraCampo1Lvl14;
        }
    }
    return imagenAsociada;
}

function drawMejoras(mejoras){
    for(var i=0; i < mejoras.length; i++){
        var imagenAsociada = asignarImagenMejora(mejoras[i][2], mejoras[i][3]);
        ctx.drawImage(imagenAsociada, mejoras[i][0],mejoras[i][1]);
    }
}

function reducirNivel(mejoras){
    var randIndex = Math.floor(Math.random()*mejoras.length);
    if(mejoras[randIndex][3] > 1){
        mejoras[randIndex][3] -= 1;
        
        mensaje = asignarMensaje(mejoras[randIndex][2], "recesion");
        mensajeCount = 0;
    }
    return mejoras;
}

function asignarMensaje(tipodeMejora, tipodeMensaje){
    var construccion = "";
    if(tipodeMensaje == "crecimiento"){
        construccion += "Los argentinos comenzaron a construir ";
    }
    if(tipodeMensaje == "recesion"){
        construccion += "La recesion hace retroceder a ";
    }
    if(tipodeMejora == "mejoraCasaHumilde1" || tipodeMejora == "mejoraBarrio1" || tipodeMejora == "mejoraBarrio2" || tipodeMejora == "mejoraBarrio3"){
        construccion += "un barrio"; 
    }
    if(tipodeMejora == "mejoraFabrica1"){
        construccion += "una fábrica";
    }
    if(tipodeMejora == "mejoraParque1"){
        construccion += "un parque";
    }
    if(tipodeMejora == "mejoraEscuela1"){
        construccion += "una escuela";
    }
    if(tipodeMejora == "mejoraComercial1"){
        construccion += "un centro de comercio"; 
    }
    if(tipodeMejora == "mejoraClub1"){
        construccion += "un Club";
    }
    if(tipodeMejora == "mejoraCampo1"){
        construccion += "un proyecto agrario"; 
    }
    return construccion;
}

function drawMensaje(mensajeN){
    var fontBoldnes = mensajeCount;
    ctx.fillStyle = "rgba(255,255,255," + fontBoldnes + ")";
    ctx.strokeStyle = "black"; 
    var fontSize = 30;
    ctx.font = fontSize + "px Consolas"; 
    ctx.textAlign = "center"; 
    ctx.fillText(mensajeN, baseCanvas.width /2, baseCanvas.height/2, baseCanvas.width-20);
    mensajeCount += 0.02;
    if(mensajeCount > 2){
        mensajeCount = 0; 
        mensaje = "";
    }
    return;
}

function drawLegisladores(){
    for(var i = 0; i < legisladores.length; i++){
        if(legisladores[i] == "varon"){
            ctx.drawImage(legislador, i*30+10, baseCanvas.height-legislador.height);
        }
        else if(legisladores[i] == "mujer"){
            ctx.drawImage(legisladora, i*30+10, baseCanvas.height-legisladora.height);
        }
    }
}

function generarMejoras(mejoras){
    while(puntasDisponibles.length > 0){
        mejoras.splice(0,0,nuevaMejora(puntasDisponibles));
        if(mejoras[0] == null){
            mejoras.splice(0,1);
        }
        puntasDisponibles = modificarPuntasDisponibles(mejoras[0], puntasDisponibles);
    }
    return mejoras;
}

function drawAnimNuevaConstr(mejora){
    if(mejora == null){
        return;
    }
    var afectacionHorizontal = asignarAfectacion(mejora[2]);
    var lineBoldnes = animNuevaConstrCount;
    ctx.lineWidth = 7;
    ctx.strokeStyle= "rgba(0,255,255," + lineBoldnes + ")";
    ctx.strokeRect(mejora[0],mejora[1],60*afectacionHorizontal,60);
    if(lineBoldnes < 1){
        animNuevaConstrCount += 0.01;
    }
    if(lineBoldnes >= 1){
        animNuevaConstr = null;
    }
}

function drawPausa(){
    ctx.drawImage(pausa, baseCanvas.width - pausa.width, baseCanvas.height - pausa.height);
}

/*function drawCompartir(){
    ctx.drawImage(compartirImg, baseCanvas.width - compartirImg.width, baseCanvas.height - compartirImg.height);
}*/


function gameMode(){
    
    colisiones = colisionesfn(tiros, ajustes, ajustesParaDestroy);
    tiros = colisiones[0]; 
    ajustes = colisiones[1];
    ajustesParaDestroy = colisiones[2];
    matadosTotales += colisiones[3];
    
    if(matadosTotales >= MATADOSXLVL){
        matadosTotales = 0; 
        crecimientoLvl +=1;
        if(crecimientoLvlReal < 10){
            crecimientoLvlReal += 1;    
        }        
        nuevoAjusteRate -=0.5;
        if(mensajeCount >= 0.9){
            mensaje = "Crecimiento: " + (crecimientoLvl / 20) + "%";
            mensajeCount = 0;
        }
    }
    if(crecimientoCount >= crecimientoRate){
        crecimientoCount = 0;
        for(var i = 0; i < mejoras.length; i++){
            if(!maxLevel(mejoras[i])){
                mejoras[i][3] += 1;
                if(mejoras[i][3] == 2){
                    mensajeCrecimiento = asignarMensaje(mejoras[i][2], "crecimiento");
                    mensaje = mensajeCrecimiento;
                    mensajeCount = 0;
                    animNuevaConstr = mejoras[i];
                    animNuevaConstrCount = 0;
                }
                break;
            }
        }
    }
    else if(crecimientoCount <= (-crecimientoRate)){
        if(mejoras != 0){
            mejoras = reducirNivel(mejoras);
        }
        crecimientoCount = 0;
    }
    else{
        crecimientoCount += crecimientoLvlReal ;
    }
    
    golpes = colisiones[4];
    for(var i = 0; i < golpes; i++){
        crecimientoLvl -= 2;
        crecimientoLvlReal -= 1;
        mensaje = "Triunfa el ajuste! El crecimiento cae a " + (crecimientoLvl / 20) + "%";
        mensajeCount = 0;
    }
    //vida -= golpes;
    //dineroSalvado += (colisiones[3] * 1256);
    
    golpes = 0;
        
    /*if(vida == 0){
        gameModeOn = false; 
        looseModeOn = true;
        requestAnimationFrame(main);
    }*/
    
    manejoCristiState();    
    tiros = manejoTiros(tiros);
    
    ajustes = generacionAjustes(ajustes);
    ajustes = manejoAjustes(ajustes);
    
    if(Math.floor(Math.random()*3000) == 30){
        bonus = true;
        gameModeOn = false;
        bonusModeOn = true; 
    }

    ajustesParaDestroy = manejoAjustesParaDestroy(ajustesParaDestroy); 
    
    drawFondo();
    drawPausa();
    drawMejoras(mejoras);
    drawAnimNuevaConstr(animNuevaConstr);
    drawMensaje(mensaje);
    drawLegisladores();
    drawCristi(mouseXPos);
    drawTiros(tiros);
    drawAjustes(ajustes);
    drawAjustesDestroy(ajustesParaDestroy);
    //drawVida(vida);
    if(gameModeOn){
        requestAnimationFrame(gameMode);
    }
    else{
        requestAnimationFrame(main);
    }

}

function bonusMode(){
    drawBonus();
    if(bonusModeOn){
        requestAnimationFrame(bonusMode); 
    }
    else{
        gameModeOn = true; 
        requestAnimationFrame(main);
    }
}


function comienzoMode(){
    ctx.fillStyle = "black"; 
    fontSize = 18; 
    ctx.font = fontSize + "px Consolas"; 
    if( (contadorComienzo < textoComienzo.length) && comienzoModeOn ){
        textoAnimComienzo += textoComienzo.slice(contadorComienzo, contadorComienzo+1);
        contadorComienzo += 1; 
        requestAnimationFrame(animComienzo);
    }
    else if(!comienzoModeOn || contadorComienzo >= textoComienzo.length ){
        if(!comienzoModeOn){
            textoAnimComienzo = "";
            instruModeOn = true; 
            comienzoModeOn = false; 
        }
        requestAnimationFrame(main);
    }
}

function animComienzo(){
    ctx.fillRect(0,0,baseCanvas.width, baseCanvas.height);
    ctx.fillStyle = "white"; 
    ctx.textAlign = "left";
    var fontSizeCarry = 0; 
    var arrayAnimText = textoAnimComienzo.split("\n");
    for(var i = 0; i < arrayAnimText.length; i ++){
        ctx.fillText(arrayAnimText[i], 20, 20 + fontSizeCarry, baseCanvas.width-20, baseCanvas.width-20);
        fontSizeCarry += fontSize; 
    }
    ctx.fillStyle = "red"; 
    ctx.textAlign = "center"; 
    ctx.fillText("Click o toca para continuar", baseCanvas.width/2, baseCanvas.height - 40, baseCanvas.width-20);
    requestAnimationFrame(comienzoMode);
}

function instruMode(){
    ctx.fillStyle = "black"; 
    ctx.fillRect(0,0,baseCanvas.width, baseCanvas.height);
    var fontSize = 15;
    ctx.font = fontSize + "px Consolas"; 
    ctx.textAlign = "left"; 
    ctx.fillStyle = "white"; 
    ctx.fillText("Los CEOs comenzaran a buscarte",20,20, baseCanvas.width-20); 
    ctx.drawImage(ceoSprite[0], 30, 35);
    ctx.drawImage(ceoSprite[0], 60, 35);
    ctx.drawImage(ceoSprite[0], 90, 35);
    ctx.fillText("Para eliminarlos podes tocar o clickear y lanzar un sol patrio", 20, 100, baseCanvas.width-20);
    ctx.fillText("Al hacerlo aumentaras tu nivel de crecimiento y los baldios se convertiran en edificios", 20, 120, baseCanvas.width-20);
    var mejoraImg;
    for(var i = 1; i <= asignarMaxLevel("mejoraBarrio2"); i++){
        mejoraImg = asignarImagenMejora("mejoraBarrio2", i); 
        ctx.drawImage(mejoraImg, 20+(i-1)*65, 140);
    }
    ctx.fillText("Cuidado! La riqueza del pueblo atrae a más CEOs hambrientos de dinero", 20, 230, baseCanvas.width-20);
    ctx.fillText("Cada cierto tiempo podrás elegir entre tres bonuses:", 20, 250, baseCanvas.width-20);
    ctx.fillText("1. Sumar compañeros aumenta el poder de golpe", 30, 270, baseCanvas.width-20);
    ctx.drawImage(bonusCompanero, 100, 290);
    ctx.fillText("2. Llevar al pueblo a la plaza asusta a los CEOs por un rato", 30, 350, baseCanvas.width-20);
    ctx.drawImage(bonusPueblo, 100, 370);
    ctx.fillText("3. Redistribuir la riqueza aumenta el crecimiento", 30, 430, baseCanvas.width-20); 
    ctx.drawImage(bonusRedistribucion, 100, 450);
    ctx.textAlign = "center"; 
    fontSize = 20; 
    ctx.font = fontSize + "px Consolas"; 
    ctx.fillText("¡MUCHA SUERTE COMPAÑERX!", baseCanvas.width/2, 540, baseCanvas.width-20);
    ctx.fillStyle = "red"; 
    ctx.textAlign = "center"; 
    ctx.fillText("Click o toca para continuar", baseCanvas.width/2, baseCanvas.height - 40, baseCanvas.width-20);
    if(instruModeOn){
        requestAnimationFrame(instruMode); 
    }
    else{
        requestAnimationFrame(main);
    }
}

function pausaMode(){
    ctx.fillStyle = "rgba(0,0,0,0.02)";
    ctx.fillRect(0,0, baseCanvas.width, baseCanvas.height);
    ctx.fillStyle = "white"; 
    ctx.textAlign = "center";
    ctx.fillText("Click o touch para continuar", baseCanvas.width /2, baseCanvas.height /2, baseCanvas.width-20); 
    if(pausaModeOn){
        requestAnimationFrame(pausaMode);
    }
    else{
        requestAnimationFrame(main);
    }
}

function presentacionMode(){
    var fondoAnim = contadorPresentacion;
    ctx.drawImage(tandroide, (baseCanvas.width - tandroide.width)/2, baseCanvas.height *0.1);
    ctx.fillStyle = "black"; 
    ctx.textAlign = "center"; 
    ctx.font = "20px Consolas"; 
    ctx.fillText("TANDROIDE JUEGOS PRESENTA", baseCanvas.width /2, baseCanvas.height*0.2 + tandroide.height + 10, baseCanvas.width-20);
    ctx.drawImage(logoIndepe, (baseCanvas.width - logoIndepe.width)/2, baseCanvas.height*0.2 + tandroide.height + 10 + 20);
    ctx.fillStyle = "rgba(255,255,255," + fondoAnim + ")";
    ctx.fillRect(0,0,baseCanvas.width, baseCanvas.height);
    if(presentacionModeOn && contadorPresentacion > 0){
        if(contadorPresentacion > 0){
            contadorPresentacion -= 0.005;
        }
        requestAnimationFrame(presentacionMode); 
    }
    else{
        presentacionModeOn = false; 
        menuModeOn = true;
        requestAnimationFrame(main);
    }
    
}

function menuMode(){
    var fondoAnim = contadorMenu; 
    ctx.drawImage(cristiContra, (baseCanvas.width - cristiContra.width) /2, (baseCanvas.height - cristiContra.height) /2+50);
    var primeraParada = Math.floor(baseCanvas.height /3); 
    var segundaParada = Math.floor(baseCanvas.height /3)*2;
    ctx.fillStyle = "rgba(63,159,255," + contadorMenu + ")";
    ctx.fillRect(0,0,baseCanvas.width, primeraParada);
    ctx.fillRect(0,segundaParada, baseCanvas.width, baseCanvas.height);
    ctx.fillStyle = "rgba(255,255,255," + contadorMenu +")";
    ctx.fillRect(0,primeraParada, baseCanvas.width, primeraParada);
    ctx.fillStyle = "white"; 
    ctx.textAlign = "center"; 
    ctx.fillText("Click o toca para continuar", baseCanvas.width/2, baseCanvas.height - 40, baseCanvas.width-20);
    if(menuModeOn){
        if(contadorMenu > 0){
            contadorMenu -= 0.01;
        }
        requestAnimationFrame(menuMode);
    }
    else{
        requestAnimationFrame(main);
    }
    
}

function main(){
    if(presentacionModeOn){
        requestAnimationFrame(presentacionMode);
    }
    if(comienzoModeOn){
        requestAnimationFrame(comienzoMode);
    }

    if(gameModeOn){
        requestAnimationFrame(gameMode);
    }

    if(instruModeOn){
        requestAnimationFrame(instruMode);
    }
    
    if(bonusModeOn){
        requestAnimationFrame(bonusMode);
    }
    if(pausaModeOn){
        requestAnimationFrame(pausaMode);
    }
    if(menuModeOn){
        requestAnimationFrame(menuMode);
    }

}

//declarando los canvas que voy a utilizar
var baseCanvas = document.querySelector("#baseCanvas");
var ctx = baseCanvas.getContext("2d");



//variables de cristina
var mouseXPos = 0;
var cristiState = "rest"; 
var shootAnimCount = 0;
//var vidaOriginal = 10; 
//var vida = vidaOriginal;

//var dineroSalvado = 0; 
    //variables de disparos de cristina
var tiros = [];
var bulletSpeed = 12;
var golpe = 10;

var bonus = false;
var legisladores = [];

var mejoras = [];

var crecimientoRate = 2000;
var crecimientoLvl = 1; 
var crecimientoLvlReal = 1;
var crecimientoCount = 0;
var MATADOSXLVL = 4;

var mensajeCrecimiento;
var mensaje ="";
var mensajeCount = 0;

var nuevoAjusteRate = 150;
var nuevoAjusteCount = 0; 
var vidaAjustes = 50;

var ajustesporRonda = 10;  
var matadosTotales = 0;

var golpes = 0;

    //variables de movimiento y manejo de ajustes
var ajustes = [];
var ajusteSpeed = 4;
var maxHeightAjustes; 

var ajustesParaDestroy = []; 

var presentacionModeOn = true;
var contadorPresentacion = 1;
var comienzoModeOn = false;
var contadorComienzo = 0; 

var menuModeOn = false;
var contadorMenu = 1;
var gameModeOn = false;
var bonusModeOn = false;
var instruModeOn = false;
var pausaModeOn = false;

var textoComienzo = `Congreso de la Nación\n
Diciembre de 2017\n
\n
El ajuste está destruyendo la Argentina\n
Cada día cierra una nueva fábrica, un comercio\n
y los argentinos pierden un nuevo derecho, entre\n
ellos el más importante, el empleo digno.-\n
\n
Sin embargo algo está por cambiar\n
Cristina acaba de asumir su banca en el Senado \n
Ayúdala a devolverle la dignidad al pueblo argentino \n
\n
Pero cuidado! \n
Los CEO's de las grandes compañías están \n
llegando de todos lados para destruir tu \n
trabajo, debes evitarlo a toda costa\n
Si evitas que lleguen al Congreso verás nuestro\n
país florecer de nuevo\n
\n
Tendras gran ayuda en el camino \n
\n
Que Perón y la fuerza te acompañen\n
P\n
V\n
`

var animNuevaConstr;
var animNuevaConstrCount = 0;

var textoAnimComienzo = "";

var mejorasLista = ["mejoraCasaHumilde1", "mejoraFabrica1", "mejoraParque1", "mejoraBarrio1", "mejoraBarrio2", "mejoraBarrio3", "mejoraEscuela1", "mejoraComercial1", "mejoraClub1", "mejoraCampo1"];

var listaPueblo = [];
var listaPuebloelim = [];
var contadorAnimPueblo = 0;
//variables de vista

window.onload = function(){
    if(detectmob()){
        var meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content="initial-scale=0.6, user-scalable=no";
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("click", mouseClickHandler, false);
    
    canvasSize(baseCanvas);
    
    cristinaImg = loadImg("imagenes/cristina.png");
    cristinaShootImg = loadImg("imagenes/cristinaShooting.png");
    
    solcito = loadImg("imagenes/solcito.png");
    
    ceoSprite = [loadImg("imagenes/ceo/ceo1.png"),loadImg("imagenes/ceo/ceo2.png")];
    
    congreso = loadImg("imagenes/congreso.png");
    
    pausa = loadImg("imagenes/pausa.png");
    //compartirImg = loadImg("imagenes/compartir.png");
    
    tandroide = loadImg("imagenes/tandroide.png");
    logoIndepe = loadImg("imagenes/logoIndepe.png");
    
    cristiContra = loadImg("imagenes/cristicontra.png");
    
    argentino = loadImg("imagenes/argentino.png");
    
    mejoraCasaHumilde1Lvl1 = loadImg("imagenes/mejoras/casahumilde1lvl1.png");
    mejoraCasaHumilde1Lvl2 = loadImg("imagenes/mejoras/casahumilde1lvl2.png");
    mejoraCasaHumilde1Lvl3 = loadImg("imagenes/mejoras/casahumilde1lvl3.png");
    mejoraCasaHumilde1Lvl4 = loadImg("imagenes/mejoras/casahumilde1lvl4.png");
    mejoraCasaHumilde1Lvl5 = loadImg("imagenes/mejoras/casahumilde1lvl5.png");
    mejoraCasaHumilde1Lvl6 = loadImg("imagenes/mejoras/casahumilde1lvl6.png");
    mejoraCasaHumilde1Lvl7 = loadImg("imagenes/mejoras/casahumilde1lvl7.png");
    
    mejoraFabrica1Lvl1 = loadImg("imagenes/mejoras/fabrica1lvl1.png");
    mejoraFabrica1Lvl2 = loadImg("imagenes/mejoras/fabrica1lvl2.png");
    mejoraFabrica1Lvl3 = loadImg("imagenes/mejoras/fabrica1lvl3.png");
    mejoraFabrica1Lvl4 = loadImg("imagenes/mejoras/fabrica1lvl4.png");
    mejoraFabrica1Lvl5 = loadImg("imagenes/mejoras/fabrica1lvl5.png");
    mejoraFabrica1Lvl6 = loadImg("imagenes/mejoras/fabrica1lvl6.png");
    
    mejoraParque1Lvl1 = loadImg("imagenes/mejoras/parque1lvl1.png");
    mejoraParque1Lvl2 = loadImg("imagenes/mejoras/parque1lvl2.png");
    mejoraParque1Lvl3 = loadImg("imagenes/mejoras/parque1lvl3.png");
    mejoraParque1Lvl4 = loadImg("imagenes/mejoras/parque1lvl4.png");
    mejoraParque1Lvl5 = loadImg("imagenes/mejoras/parque1lvl5.png");
    mejoraParque1Lvl6 = loadImg("imagenes/mejoras/parque1lvl6.png");
    
    mejoraBarrio1Lvl1 = loadImg("imagenes/mejoras/barrio1lvl1.png");
    mejoraBarrio1Lvl2 = loadImg("imagenes/mejoras/barrio1lvl2.png");
    mejoraBarrio1Lvl3 = loadImg("imagenes/mejoras/barrio1lvl3.png");
    mejoraBarrio1Lvl4 = loadImg("imagenes/mejoras/barrio1lvl4.png");
    mejoraBarrio1Lvl5 = loadImg("imagenes/mejoras/barrio1lvl5.png");
    mejoraBarrio1Lvl6 = loadImg("imagenes/mejoras/barrio1lvl6.png");
    mejoraBarrio1Lvl7 = loadImg("imagenes/mejoras/barrio1lvl7.png");
    mejoraBarrio1Lvl8 = loadImg("imagenes/mejoras/barrio1lvl8.png");
    mejoraBarrio1Lvl9 = loadImg("imagenes/mejoras/barrio1lvl9.png");
    mejoraBarrio1Lvl10 = loadImg("imagenes/mejoras/barrio1lvl10.png");
    mejoraBarrio1Lvl11 = loadImg("imagenes/mejoras/barrio1lvl11.png");
    
    mejoraBarrio2Lvl1 = loadImg("imagenes/mejoras/barrio2lvl1.png");
    mejoraBarrio2Lvl2 = loadImg("imagenes/mejoras/barrio2lvl2.png");
    mejoraBarrio2Lvl3 = loadImg("imagenes/mejoras/barrio2lvl3.png");
    mejoraBarrio2Lvl4 = loadImg("imagenes/mejoras/barrio2lvl4.png");
    mejoraBarrio2Lvl5 = loadImg("imagenes/mejoras/barrio2lvl5.png");
    mejoraBarrio2Lvl6 = loadImg("imagenes/mejoras/barrio2lvl6.png");
    mejoraBarrio2Lvl7 = loadImg("imagenes/mejoras/barrio2lvl7.png");
    
    mejoraCampo1Lvl1 = loadImg("imagenes/mejoras/campo1lvl1.png");
    mejoraCampo1Lvl2 = loadImg("imagenes/mejoras/campo1lvl2.png");
    mejoraCampo1Lvl3 = loadImg("imagenes/mejoras/campo1lvl3.png");
    mejoraCampo1Lvl4 = loadImg("imagenes/mejoras/campo1lvl4.png");
    mejoraCampo1Lvl5 = loadImg("imagenes/mejoras/campo1lvl5.png");
    mejoraCampo1Lvl6 = loadImg("imagenes/mejoras/campo1lvl6.png");
    mejoraCampo1Lvl7 = loadImg("imagenes/mejoras/campo1lvl7.png");
    mejoraCampo1Lvl8 = loadImg("imagenes/mejoras/campo1lvl8.png");
    mejoraCampo1Lvl9 = loadImg("imagenes/mejoras/campo1lvl9.png");
    mejoraCampo1Lvl10 = loadImg("imagenes/mejoras/campo1lvl10.png");
    mejoraCampo1Lvl11 = loadImg("imagenes/mejoras/campo1lvl11.png");
    mejoraCampo1Lvl12 = loadImg("imagenes/mejoras/campo1lvl12.png");
    mejoraCampo1Lvl13 = loadImg("imagenes/mejoras/campo1lvl13.png");
    mejoraCampo1Lvl14 = loadImg("imagenes/mejoras/campo1lvl14.png");
    
    mejoraEscuela1Lvl1 = loadImg("imagenes/mejoras/escuela1lvl1.png");
    mejoraEscuela1Lvl2 = loadImg("imagenes/mejoras/escuela1lvl2.png");
    mejoraEscuela1Lvl3 = loadImg("imagenes/mejoras/escuela1lvl3.png");
    mejoraEscuela1Lvl4 = loadImg("imagenes/mejoras/escuela1lvl4.png");
    mejoraEscuela1Lvl5 = loadImg("imagenes/mejoras/escuela1lvl5.png");
    mejoraEscuela1Lvl6 = loadImg("imagenes/mejoras/escuela1lvl6.png");
    
    mejoraComercial1Lvl1 = loadImg("imagenes/mejoras/comercial1lvl1.png");
    mejoraComercial1Lvl2 = loadImg("imagenes/mejoras/comercial1lvl2.png");
    mejoraComercial1Lvl3 = loadImg("imagenes/mejoras/comercial1lvl3.png");
    mejoraComercial1Lvl4 = loadImg("imagenes/mejoras/comercial1lvl4.png");
    mejoraComercial1Lvl5 = loadImg("imagenes/mejoras/comercial1lvl5.png");
    mejoraComercial1Lvl6 = loadImg("imagenes/mejoras/comercial1lvl6.png");
    mejoraComercial1Lvl7 = loadImg("imagenes/mejoras/comercial1lvl7.png");
    mejoraComercial1Lvl8 = loadImg("imagenes/mejoras/comercial1lvl8.png");
    mejoraComercial1Lvl9 = loadImg("imagenes/mejoras/comercial1lvl9.png");
    
    mejoraClub1Lvl1 = loadImg("imagenes/mejoras/club1lvl1.png");
    mejoraClub1Lvl2 = loadImg("imagenes/mejoras/club1lvl2.png");
    mejoraClub1Lvl3 = loadImg("imagenes/mejoras/club1lvl3.png");
    mejoraClub1Lvl4 = loadImg("imagenes/mejoras/club1lvl4.png");
    mejoraClub1Lvl5 = loadImg("imagenes/mejoras/club1lvl5.png");
    mejoraClub1Lvl6 = loadImg("imagenes/mejoras/club1lvl6.png");
    mejoraClub1Lvl7 = loadImg("imagenes/mejoras/club1lvl7.png");
    mejoraClub1Lvl8 = loadImg("imagenes/mejoras/club1lvl8.png");
    mejoraClub1Lvl9 = loadImg("imagenes/mejoras/club1lvl9.png");
    mejoraClub1Lvl10 = loadImg("imagenes/mejoras/club1lvl10.png");
    mejoraClub1Lvl11 = loadImg("imagenes/mejoras/club1lvl11.png");
    mejoraClub1Lvl12 = loadImg("imagenes/mejoras/club1lvl12.png");
    mejoraClub1Lvl13 = loadImg("imagenes/mejoras/club1lvl13.png");
    
    mejoraBarrio3Lvl1 = loadImg("imagenes/mejoras/barrio3lvl1.png");
    mejoraBarrio3Lvl2 = loadImg("imagenes/mejoras/barrio3lvl2.png");
    mejoraBarrio3Lvl3 = loadImg("imagenes/mejoras/barrio3lvl3.png");
    mejoraBarrio3Lvl4 = loadImg("imagenes/mejoras/barrio3lvl4.png");
    mejoraBarrio3Lvl5 = loadImg("imagenes/mejoras/barrio3lvl5.png");
    mejoraBarrio3Lvl6 = loadImg("imagenes/mejoras/barrio3lvl6.png");
    mejoraBarrio3Lvl7 = loadImg("imagenes/mejoras/barrio3lvl7.png");
    mejoraBarrio3Lvl8 = loadImg("imagenes/mejoras/barrio3lvl8.png");
    mejoraBarrio3Lvl9 = loadImg("imagenes/mejoras/barrio3lvl9.png");
    mejoraBarrio3Lvl10 = loadImg("imagenes/mejoras/barrio3lvl10.png");
    mejoraBarrio3Lvl11 = loadImg("imagenes/mejoras/barrio3lvl11.png");
    mejoraBarrio3Lvl12 = loadImg("imagenes/mejoras/barrio3lvl12.png");
    
    bonusCompanero = loadImg("imagenes/bonus/companero.png");
    bonusPueblo = loadImg("imagenes/bonus/pueblo.png");
    bonusRedistribucion = loadImg("imagenes/bonus/redistribucion.png");
    
    legislador = loadImg("imagenes/legislador.png");
    legisladora = loadImg("imagenes/legisladora.png");
        
    monedaSprite = loadMonedaSprite();
    
    puntasDisponibles = generarPuntasDisponibles();
    maxHeightAjustes = detMaxHeightAjustes();
    mejoras = generarMejoras(mejoras);
    puntasDisponibles = generarPuntasDisponibles();
    
    main();
}
