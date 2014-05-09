/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    geoPos: Object,
    db: Object,
    watchID: Object,
    resumeNext: String,
    cfg: Object,
    host: String,
    syncData: Object,
    lst: Object,
    devCliErr: String,
    devCliOk: 0,
    devCliCnt: 0,
    devEvErr: String,
    devEvOk: 0,
    devEvCnt: 0,
    cliente: String,
    //once: String,
    cliData: Object,
    tmrSetup: String,
    tmrStep: String,
    cliFilter: String,
    tick: 0,
    nrem: String,
    vitems: Object,
    viva: Object,
    vdescuento: Object,
    vdescr: Object,
    cieOk: 0,
    cieCnt: 0,
    ticket: 0,
    factura: String,
    confirmBtn: 0,
    srvURL: String,
    // Application Constructor
    initialize: function() {
        console.log('app.initialize');
	this.tmrStep='0';
	this.once='';
	this.resumeNext='';
        this.bindEvents();
	this.host='SERVER_PROD_WAN';
	this.cliFilter='CERCANOS';
	this.cfg=new Object();
	this.srvURL = '';
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;	
	$.mobile.selectmenu.prototype.options.nativeMenu = true;
	//navigator.splashscreen.show();
	
	var $this = $( this ),
	  theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
	  msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
	  textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
	  textonly = !!$this.jqmData( "textonly" );
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( "show", {
		text: msgText,
		textVisible: textVisible,
		theme: theme,
		textonly: textonly,
		html: html
	});
	//this.onDeviceReady();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
	this.tmrStep='00';
        document.addEventListener('deviceready', this.onDeviceReady, false);
	//document.addEventListener('online', this.onOnline, false);
	//document.addEventListener('offline', this.onOffline, false);
	document.addEventListener('backbutton', this.onBack, false);
	document.addEventListener('menubutton', this.onMenu, false); 
	//$( document ).delegate("#pRem", "pageinit", this.OnOpenRem);
      
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	//start setup timer
        //app.receivedEvent('deviceready');
        console.log('app.onDeviceReady');//{ frequency: 3000, enableHighAccuracy: true }
	//navigator.splashscreen.show();
	app.tmrStep='1';
	app.tmrSetup= setInterval(app.onSetup, 500);
    },
    onBack: function(e){
	/*
	if($.mobile.activePage.is('#homepage')){
	    e.preventDefault();
	    navigator.app.exitApp();
	}
	else {
	    navigator.app.backHistory()
	}
	*/
	e.preventDefault();
	if($.mobile.activePage.is('#pCliEdit')){
	    $.mobile.changePage($("#pCli"), { });
	    //navigator.app.exitApp();	    
	}else if($.mobile.activePage.is('#pCli')){
	    $.mobile.changePage($("#menu"), { });
	}else if($.mobile.activePage.is('#pCierre')){
	    $.mobile.changePage($("#menu"), { });
	}else if($.mobile.activePage.is('#pRem')){
	    $.mobile.changePage($("#menu"), { });
	}else if($.mobile.activePage.is('#pSync')){
	    $.mobile.changePage($("#menu"), { });
	}else if($.mobile.activePage.is('#pVenta')){
	    $.mobile.changePage($("#pCli"), { });
	}else if($.mobile.activePage.is('#pGeo')){
	    $.mobile.changePage($("#menu"), { });
	}else if($.mobile.activePage.is('#pDevId')){
	    $.mobile.changePage($("#menu"), { });
	}else if($.mobile.activePage.is('#menu')){
	    //$.mobile.changePage($("#pCli"), { });
	}
      
    },    
    onMenu: function(e){
	console.log('onMenu');
	e.preventDefault();
	if($.mobile.activePage.is('#pCliEdit')){
	    //open contextual menu
	    //$.mobile.changePage($("#pCli"), { });
	    //navigator.app.exitApp();	    
	}
      
    },    
    onSetup: function(){
	console.log('onSetup '+app.tmrStep);
	if(app.tmrStep=='4'){
	  //abrir pagina cliente
	  app.tmrStep='5';
	  //app.onDeviceId();
	  clearInterval(app.tmrSetup);
	  app.Run();
	}
	if(app.tmrStep=='3'){
	  //app.watchID=navigator.geolocation.watchPosition(app.onGeoLocation, app.onError,{ frequency: 3000, enableHighAccuracy: true });
	  //document.addEventListener("menubutton", app.onMenuButton, false);
	  app.db = window.openDatabase("distro", "1.2", "Distro", 8000000);
	  app.db.transaction(app.dbCreate, app.onError, app.onDbCreated);
	  app.db.transaction(app.dbLoadCfg, app.onError);
	  app.db.transaction(app.dbLst, app.onError);
	  app.tmrStep='4';
	  //
	}
	if(app.tmrStep=='2'){
	  //abrir pagina cliente
	  app.tmrStep='3';
	  $.mobile.changePage($("#menu"), {});
	}
	if(app.tmrStep=='1'){
	  console.log('onSetup 1!');  
	  app.startGeoPos();	
	  //abrir pagina menubutton
	  $.mobile.changePage($("#pCli"), {});     
	  app.tmrStep='2';
	}

	//disable setup timer
    },
    /*
    onOnLine: function() {
        //app.receivedEvent('deviceready');
        console.log('app.onOnLine');
	app.netMode='online';
	
    },
    onOffLine: function() {
        //app.receivedEvent('deviceready');
        console.log('app.onOffLine');
	app.netMode='offline';
    },
    */
  
    //registra el evento
    regEv: function(descr,id_cliente,id_cli_device,img,imgUri,idVenta){
      console.log(' '+ descr);
      if(typeof id_cliente === "undefined") {
        id_cliente = 0;
      }	
      if(typeof id_cli_device === "undefined") {
        id_cli_device = 0;
      }	
      if(typeof img === "undefined") {
        img = '';
      }	
      if(typeof imgUri === "undefined") {
        imgUri = '';
      }	
      if(typeof idVenta === "undefined") {
        idVenta = '';
      }	
      //evento (ID,EVENTO,ID_DEVICE,ID_CLIENTE,ID_CLI_DEVICE,LAT,LON,PREC,SPEED,FECHA)
      try{
	app.db.transaction(function(tx){ tx.executeSql('insert into evento(EVENTO,ID_CLIENTE,ID_CLI_DEVICE,LAT,LON,PREC,SPEED,FECHA,IMG,IMGURI,ID_VENTA) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
	  ,[
	    descr
	    ,id_cliente
	    ,id_cli_device
	    ,app.geoPos.coords.latitude
	    ,app.geoPos.coords.longitude
	    ,app.geoPos.coords.accuracy
	    ,app.geoPos.coords.speed
	    ,app.geoPos.timestamp
	    ,img
	    ,imgUri
	    ,idVenta
	  ]
	  ,function(){ console.log(' regEv Ok'); }
	  ,app.onError);}
	  , app.onError);
      }catch(e){
	console.log('  err '+ JSON.stringify(e));
      }
    },
    onError: function(err) {
	console.log('onError '+ JSON.stringify(err));
	$.mobile.loading( "hide" );
	if(app.resumeNext==''){
	  document.getElementById('msg').innerHTML ='Error '+ err.code +' '+ err.message;
	  alert('code: '    + err.code    + '\n' + 'message: ' + err.message + '\n');
	}else{
	  app.resumeNext='';
	}
    },
    confirm: function(titulo,texto,botones){
      //var ret=confirm("Esta seguro que desea Cerrar?");
      var ret=0;
      app.confirmBtn=0;
      navigator.notification.confirm(
        texto, // message
         function (btn){ app.confirmBtn=btn; },            // callback to invoke with index of button pressed
        titulo,           // title
        botones         // buttonLabels
      );
      console.log('btn '+ ret);
      return app.confirmBtn;
    },
    onGeoLocationFail: function(error) {
      $('#geolocationErr').html('Status: ' + error.code+' '+error.message+' '+app.tick );
    },
    onGeoLocation: function(position) {
	console.log('onGeoLocation');

	
        var element = document.getElementById('geolocation');
	var dx=0.0;
	var dy=0.0;
        var ts=position.timestamp;
        app.onGeoLocationFail({code: ' ' ,message: 'Ok ' });
        
	//if(String(position.timestamp).search(" ")<0){
	  
          ts=(new Date(position.timestamp)).toISOString();
	  console.log(' convert timestamp '+ position.timestamp+' to '+ts );
	//}
	  
        element.innerHTML = 'Latitud: '           + position.coords.latitude              + '<br />' +
                            'Longitud: '          + position.coords.longitude             + '<br />' +
                            //'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Precisión: '           + position.coords.accuracy              + '<br />' +
                            //'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            //'Heading: '            + position.coords.heading               + '<br />' +
                            'Velocidad: '              + position.coords.speed                 + '<br />'+
	                    'Fecha/Hora: '          + ts                    + '<br />';
	try{
	  dx=0;
	  dy=0;
	  dx=position.coords.longitude - app.geoPos.coords.longitude;
	  dy=position.coords.latitude - app.geoPos.coords.latitude;	  
	}catch(e){
	  console.log('  dx or dy error '+JSON.stringify(e));
	}
	app.geoPos=JSON.parse(JSON.stringify(position));
        app.geoPos.timestamp=ts;
	if((app.tick%30) == 0 && app.tmrStep>='4'){
	   app.regEv('TRK');
	}
    },
    onDeviceId: function(){
        $.mobile.changePage($("#pDevId"), {});     
	app.getSrvUrl(function(srvUrl){
	    var element = document.getElementById('deviceProperties');
	    element.innerHTML = 'SISTEMA: DISTRO v1.0.4 <br>' +
				'TmrStep: '  + app.tmrStep  + '<br>' +
				'UUID: '     + device.uuid     + '<br>' +
				'Model: '    + device.model    + '<br>' +
				'Platform: ' + device.platform + '<br>' +
				'Version: '  + device.version  + '<br>' +
				'Network: '  + navigator.connection.type+'<br>'+
				'SERVER: '  + srvUrl+'<br>';
	    //$('#cfg.id').append('...');
	    document.getElementById('cfg.id').innerHTML +='...';
	});
    },

    dbCreate: function(tx){
      console.log('dbCreate');
      //tx.executeSql('DROP TABLE IF EXISTS DEMO');
      //tx.executeSql('create table if not exists evento (ID,EVENTO,ID_DEVICE,ID_CLIENTE,ID_CLI_DEVICE,LAT,LON,PREC,SPEED,FECHA)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS cfg (k unique, v)');
      //tx.executeSql('CREATE TABLE IF NOT EXISTS codigo (tbl,codigo,descr)');
      app.resumeNext='1';
      /*
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_LAN", "10.7.3.4/~cfb/distro")');
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_WAN", "cfaure.homelinux.net:8889/~cfb/distro")');  
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_PROD_LAN", "192.168.0.100/distro")');
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_PROD_WAN", "mutti.dnsdynamic.net/distro")');  
      */
      //tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_LAN", "10.7.3.4/~cfb/distro")');
      //tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_WAN", "cfaure.homelinux.net:8889/~cfb/distro")');  
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_PROD_LAN", "192.168.0.100/distro")');
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("SERVER_PROD_WAN", "190.52.189.5/distro")');  
      
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("ID", "")');      
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("ID_REPARTIDOR", "")');      
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("REPARTIDOR", "")');      
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("PIN", "")');
      tx.executeSql('INSERT INTO cfg (k,v) VALUES ("LID", "10000")');
    },
    onDbCreated: function(){
      console.log('onDbCreated');
      alert("onDbCreated");
    },
    dbSaveCfg: function(tx){
      console.log('dbSaveCfg');
      for (var k in app.cfg){
	tx.executeSql('UPDATE cfg SET v="'+ app.cfg[k]+'" WHERE k="'+k+'"');
      }
    },
    getSrvUrl: function(execAfter){
      //app.host='SERVER_PROD_WAN';
      var ok=false;
      if(typeof execAfter === "undefined")
	execAfter=function(srvUrl){ };      
      if(navigator.connection.type=='wifi'){
	if(app.srvURL === '' ){ 
	  var url='http://'+app.cfg['SERVER_PROD_LAN']+'/distro.php?uuid='+device.uuid;
	  $.ajaxSetup({async: true, timeout: 5000});
	  $.getJSON(url+'&e=ping',{},function(){ 
		//PING OK  
		console.log('ping ok prod_lan'); 
		app.host='SERVER_PROD_LAN'; 
		app.srvURL='http://'+app.cfg[app.host]+'/distro.php?uuid='+device.uuid;
	        $.ajaxSetup({async: true, timeout: 15000});
		execAfter(app.srvURL);
	    })
	    .fail(function(){ 
		console.log('ping fail prod_lan'); 
		//intentar prod wan 
	      url='http://'+app.cfg['SERVER_PROD_WAN']+'/distro.php?uuid='+device.uuid;  
	      $.getJSON(url+'&e=ping',{},function(){ 
		//PING OK  
		console.log('ping ok prod_wan'); 
		app.host='SERVER_PROD_WAN'; 
		app.srvURL='http://'+app.cfg[app.host]+'/distro.php?uuid='+device.uuid;
	        $.ajaxSetup({async: true, timeout: 15000});
		execAfter(app.srvURL);
		})
		.fail(function(){ 
		    console.log('ping fail prod_wan'); 
		    //intentar prod wan 
		    //app.host='SERVER_PROD_WAN'; 
		    //app.srvURL='http://'+app.cfg[app.host]+'/distro.php?uuid='+device.uuid; 
		  
		})
		.always(function(){ 
		  console.log('ping wan always'); 
		  
		})
		;
	      
	    })
	    .always(function(){ 
	      console.log('ping lan always'); 
	      //$.ajaxSetup({async: true, timeout: 15000}); 
	      //execAfter(app.srvURL);
	      
	    })
	    ;
	}else{
	  // app.srvURL completo
	  execAfter(app.srvURL);
	  
	}
	//app.host='SERVER_PROD_LAN';
	//app.host='SERVER_PROD_WAN';
      }else{ //3G
	if(app.srvURL === '' ){ 
	  url='http://'+app.cfg['SERVER_PROD_WAN']+'/distro.php?uuid='+device.uuid;  
	  $.getJSON(url+'&e=ping',{},function(){ 
	    //PING OK  
	    console.log('ping ok 3g prod_wan'); 
	    app.host='SERVER_PROD_WAN'; 
  	    app.srvURL='http://'+app.cfg[app.host]+'/distro.php?uuid='+device.uuid;
	    $.ajaxSetup({async: true, timeout: 20000});
	    execAfter(app.srvURL);
	    })
	    .fail(function(){ 
		console.log('ping fail 3g prod_wan'); 
		alert('Sin conexion al servidor');
		//intentar prod wan 
		//app.host='SERVER_PROD_WAN'; 
		//app.srvURL='http://'+app.cfg[app.host]+'/distro.php?uuid='+device.uuid; 	      
	    })
	    .always(function(){ 
	      console.log('ping wan 3g always'); 	      
	    })
	    ;	  
	}else{
	  // app.srvURL completo
	  execAfter(app.srvURL);
        }
      }
      //console.log('URL '+url);
      return app.srvURL;
    },
    dbLoadCfg: function(tx){
      console.log('dbLoadCfg');
      //alert("dbLoadCfg");
      //tx.executeSql('DROP TABLE IF EXISTS DEMO');
      tx.executeSql('SELECT k,v FROM cfg',[],app.onDbLoadCfg,app.onError);
      //tx.executeSql('SELECT count(*) FROM cfg',[],app.onDbLoadCfg,app.onError);
      
    },
    onDbLoadCfg: function(tx,rs){
      console.log('onDbLoadCfg');
      //alert("onDbLoadCfg");
      //$('#busy').hide();
      //$('#cfg').empty();
      var len = rs.rows.length;
      //var element = document.getElementById('cfg');
      $('#cfg').html('');
      //element.innerHTML = len; 
      for (var i=0; i<len; i++) {
	  var r = rs.rows.item(i);
	  app.cfg[r.k]=r.v;
	  if(r.k!=='PIN')
	    $('#cfg').append('' + r.k +' = ' +r.v + '<br>');
      }
      //document.getElementById('cfg.id').innerHTML 
      //$('#cfg').listview();
      
      if(app.cfg['ID']>'' && app.cfg['ID']!=='undefined'){
	//dispositivo registrado
	//app.db.transaction(app.dbLoadCliLst, app.onError,app.dbPostLoadCliLst);
	//$.mobile.loadPage( "page2.html", { showLoadMsg: false } );
	//$.mobile.loadPage($("#pCli"), { showLoadMsg: false});     
	document.getElementById('cfg.id').innerHTML ='Mutti ID:'+app.cfg['ID']+'<br>Repartidor: '+app.cfg['ID_REPARTIDOR']+' '+app.cfg['REPARTIDOR'];
	app.refreshCliList();
	//app.Run();
      }else{
	//dispositivo no registrado
	console.log('  dispositivo no registrado en el servidor');
	//$('#cfg.id').empty().append('dispositivo no registrado en el servidor');
	document.getElementById('cfg.id').innerHTML ='Dispositivo no registrado en el servidor';
	//intentar registro
	app.srvRegister();
      }
    },
    srvRegister: function(){
      console.log('srvRegister');
      //var url='http://'+app.cfg['SERVER_LAN']+'/distro.php?e=reg&uuid='+device.uuid
      app.getSrvUrl(function(srvURL){
	  var url=srvURL+'&e=reg'
	  console.log('  url '+url);
	  //ajax call to server
	  $.getJSON(url, app.onSrvData)
	    .fail(app.onSrvFail)
	    .always(app.onSrvAlways);
      });
    },
    onSrvData: function(data){
      console.log('onSrvData '+JSON.stringify(data));
      //data=eval("("+data+")");
      //console.log('onSrvData '+data['e']);
      //
      if(data.e=='reg'){
	//respuesta de registro
	if(data.id>''){
	  app.cfg['ID']=data.id;
	  //save cfg
	  //cargar lista de clientes
	  app.db.transaction(app.dbSaveCfg, app.onError, app.Run);
	}
	if(data.msg>''){
	  //$('#cfg.id').empty().append(data.msg);
	  //document.getElementById('cfg.id').innerHTML =data.msg;
	  alert(data.msg);
          navigator.app.exitApp();
	}
      }
      if(data.e=='sync'){
	//recibe inicializacion
	app.syncData = data;
	console.log(' data.cmds.length '+data.cmds.length);
	app.db.transaction(app.dbSyncStep, app.onError);
      }
      if(data.e=='devCli'){
	//console.log(JSON.stringify(data));
	if(data.msg>''){
	  console.log('  devCli.msg '+data.msg);
	  //alert( data.msg );
	  if(!app.devCliErr)
	    app.devCliErr=data.msg;
	  document.getElementById('synCli').innerHTML =data.msg;  
	}else{
	  if(data.new_id_cliente){
	    app.db.transaction(function(tx){ 
		tx.executeSql('update cliente set id_cliente=?, ZZ_MODIFIED=? where ID_CLIENTE=?',[data.new_id_cliente,'',data.id_cliente]
		  ,function(e){console.log('  update evento set id_cliente='+data.new_id_cliente+' where ID_CLIENTE='+data.id_cliente);}
		  ,app.onError);
	        tx.executeSql('update entr set id_cliente=? where ID_CLIENTE=?',[data.new_id_cliente,data.id_cliente]
		  ,function(e){console.log('  update entr set id_cliente='+data.new_id_cliente+' where ID_CLIENTE='+data.id_cliente);}
		  ,app.onError);
	        tx.executeSql('update evento set id_cliente=? where ID_CLIENTE=?',[data.new_id_cliente,data.id_cliente]
		  ,function(e){console.log('  update evento set id_cliente='+data.new_id_cliente+' where ID_CLIENTE='+data.id_cliente);}
		  ,app.onError);
	    }, app.onError);
	  }
	  app.devCliOk=app.devCliOk+1;
	}
	if(app.devCliOk==app.devCliCnt){
	  app.db.transaction(app.dbSyncEv, app.onError);
	}
      }
      if(data.e=='devEv'){
	//console.log(JSON.stringify(data));
	if(data.msg>''){
	  console.log('  msg '+data.msg);
	  //alert( data.msg );
	  if(!app.devCliErr)
	    app.devEvErr=data.msg;
	  document.getElementById('synEv').innerHTML =data.msg;  
	}else{
	  
	  //if(data.cnt){
	  //  app.db.transaction(function(tx){ tx.executeSql('delete from evento where rowid='+data.id,[],null,app.onError);}, app.onError);
	  //}
	  
	  app.devEvOk=app.devEvOk+data.cnt;
	  document.getElementById('synEv').innerHTML = app.devEvOk + '/' + app.devEvCnt
	}
	if(app.devEvOk>=app.devEvCnt){
	  app.db.transaction(
	    function(tx){
	      console.log('devPic');
	      //validar los datos 
	      //guardar
	      document.getElementById('synCli').innerHTML ="Sincronizando Exportando Fotos...";
	      tx.executeSql("select * FROM evento WHERE IMG > ''",[],
		function(tx, results) {
			var len = results.rows.length;
			var srvData;
			console.log("Foto -> host: " + len );
			app.devEvCnt=len;
			app.devEvOk=0;
			for (var i=0; i<len; i++){
			    console.log("Row = " + i + " ID = " + results.rows.item(i).ID_CLIENTE + " IMG =  " + results.rows.item(i).IMG);
			    app.imgUpload(results.rows.item(i).IMGURI,results.rows.item(i).IMG,results.rows.item(i).ID_CLIENTE);
			}
			if(len==0){
			  app.onSrvData({e:'devPic',msg:'Sin Fotos'});
			}
		} );
	    }, app.onError);
	} 
      }
      
      if(data.e=='devPic'){
	//rta enviar fotos
	//console.log(JSON.stringify(data));
	if(data.msg>''){
	  console.log('  devPic.msg '+data.msg);
	  //alert( data.msg );
	  if(!app.devCliErr)
	    app.devEvErr=data.msg;
	  document.getElementById('synCli').innerHTML =data.msg;  
	}else{
	  
	  //if(data.cnt){
	  //  app.db.transaction(function(tx){ tx.executeSql('delete from evento where rowid='+data.id,[],null,app.onError);}, app.onError);
	  //}
	  
	  app.devEvOk = app.devEvOk + 1;
	  document.getElementById('synEv').innerHTML = app.devEvOk + '/' + app.devEvCnt

	  console.log('   img Uploaded OK');
	  //console.log("   Code = " + data.responseCode);
	  //console.log("   Response = " + data.response);
	  //console.log("   Sent = " + data.bytesSent);

	}
	if(app.devEvOk>=app.devEvCnt){
	  app.db.transaction(function(tx){ tx.executeSql('delete from evento',[]
	    ,function(){ console.log(' delete eventos Ok'); }
	    ,app.onError);}, app.onError);
	  app.db.transaction(app.dbLst, app.onError);

	      
	  //buscar clientes desde el servidor
	  console.log('hostCli');
	  var url=app.srvURL+'&e=hostCli'
	  console.log('  url '+url);
	  document.getElementById('synCli').innerHTML ="Sincronizando Importando Clientes...";
	  //ajax call to server
	  $.getJSON(url, app.onSrvData)
	    .fail(app.onSrvFail)
	    .always(app.onSrvAlways);   
	}
      }
      if(data.e=='hostCli'){
	//recibe inicializacion
	app.syncData = data;
	if(data.cmds){
	  console.log(' data.cmds.length '+data.cmds.length);
	  app.db.transaction(app.dbSyncHCli, app.onError,app.onSyncEnd);
	}else{
	  console.log(' Host-> device Sin clientes');
	  app.onSyncEnd();
	}
      }
      if(data.e=='cierredet'){
	//recibe inicializacion
	app.syncData = data;
	if(data.cmds){
	  console.log(' ciedet data.cmds.length '+data.cmds.length);
	  //app.db.transaction(app.dbSyncHCli, app.onError,app.onSyncEnd);
	  app.db.transaction(
	  function(tx){
	    //console.log('  dbSyncHCli ');
	    for( var i =0;i< app.syncData.cmds.length;i++){
	      console.log('  cmdciedet '+app.syncData.cmds[i].CMD);
	      tx.executeSql(app.syncData.cmds[i].CMD);     
	    }
	    app.cieOk=app.cieOk+1;
	  }
	  ,app.onError
	  ,function(){
	    console.log('  cierredet cmds ok '+app.cieOk+'/ '+app.cieCnt);
	    if(app.cieOk>=app.cieCnt){
	      console.log('---------BORRAR ENTREGAS ');
	      app.borrarEntr();
	      //$.mobile.changePage($("#menu"), { });
	    }
	  }
	      
	  );
	}else{
	  if(data.success){
	    console.log('Rx Cierredet Sin vta');
	    console.log('---------BORRAR ENTREGAS B');
	    app.borrarEntr();
	  }else{
	    app.onError({message: data.msg, code:-1});   
	  //app.onSyncEnd();
	  }
	}
      }
      if(data.e=='cierrecab'){
	//recibe inicializacion
	app.syncData = data;
	if(data.success)
	  app.cieOk=app.cieOk+1;
	if(app.cieOk>=app.cieCnt){
	  console.log('---------INICIAR CIERRE DET');
	  //app.borrarEntr();
	  app.cieOk=0;
	  app.cierreDet();
	}
	
      }
      if(data.e=='cierre0'){
	//recibe inicializacion
	app.syncData = data;
	if(data.success){
	  console.log('---------CIERRE VACIO');
	  app.borrarEntr();
	}	
      }
    },
    onSrvFail: function(jqxhr, textStatus, error ) {
      console.log('onSrvFail ');
      $.mobile.loading( "hide" );
      var err = textStatus + ', ' + error;
      console.log( "  getJSON Failed: " + err);
      document.getElementById('msg').innerHTML ="getJSON Failed: " + err;
    },
    onSrvAlways: function(){
      $.mobile.loading( "hide" );
      console.log('onSrvAlways ');
      	
    },
    dbLoadCli: function(tx){
      console.log('dbLoadCli'+app.cliente);
      var sql="SELECT c.*,coalesce((select p.ID_VENTA from preventa p where p.ID_CLIENTE=? and p.ID_VENTA not in (select e.ID_VENTA from evento e where e.EVENTO='VTA.ENTR' and e.ID_VENTA=p.ID_VENTA) LIMIT 1 ),0) as PREVTA FROM cliente c WHERE c.id_cliente=?";
      console.log('SQLITE '+sql);
      console.log('PARAMS '+app.cliente+' '+app.cliente);
      tx.executeSql(sql,[app.cliente,app.cliente],app.dbOnLoadCli,app.onError);    
    },
    dbOnLoadCli: function(tx, results){
	//$.mobile.showPageLoadingMsg(true);
	var len = results.rows.length;
	console.log('dbOnLoadCli '+len);

	//$("#lstCli").html('');
	for (var i=0; i<len; i++){
	    var row= results.rows.item(i);
	    app.cliData=JSON.parse(JSON.stringify(row));
	    console.log('clidata '+ JSON.stringify(app.cliData));
	    for (var k in results.rows.item(i)) {
	      //console.log('   K '+ k );
	      try{
		var item=$("#tn"+k,"#pCliEdit");
		var v = results.rows.item(i)[k];
		if(item){
		  if((k.substring(0,3)=='ID_' || k.substring(0,10)=='TIPO_VENTA'||k.substring(0,8)=='GENERA_I') && k != 'ID_CLIENTE'){
		    console.log('   LST '+ k + ' ' +v);
		    //item.selectmenu();
		    // Select the relevant option, de-select any others
		    item.val(v).attr('selected', true).siblings('option').removeAttr('selected');
		    item.selectmenu('refresh',true);
		  }else{
		    item.val(v);
		  }

		}
	      }catch(e){
		console.log(' cli refresh failed');
	      }
	      
	    }
	    //$("#tnNOMBRE","#pCliEdit").val(row.NOMBRE);
	    //var htmlData = '<li id="'+row.ID_CLIENTE+'" onClick="app.onCliSelect('+row.ID_CLIENTE+')"><a href="#"><h2>'+row.NOMBRE+'</h2><p class="ui-li-aside">'+row.DIRECCION+'</p></a></li>';
	    //var htmlData = '<li id="'+row.ID_CLIENTE+'"><a href="#"><h2>'+row.ID_CLIENTE+'</h2><p class="ui-li-aside">'+row.ID_CLIENTE+'</p></a></li>';
	    //console.log(htmlData);
	    //$("#lstCli").append(htmlData);
	}
	//$.mobile.changePage($("#pCliEdit"), {});     
	//$("#lstCli").listview().listview('refresh');
	//$.mobile.hidePageLoadingMsg();
	//
	//$(document).off('click', '#lstCli li a', app.onCliSelect);	
	//$(document).on('click', '#lstCli li a', app.onCliSelect);	

    },
    openCli: function(){
      console.log('openCli');
      //$.mobile.showPageLoadingMsg(true);
      $.mobile.changePage($("#pCli"), {});     
      //app.refreshCliList();
      //app.db.transaction(app.dbLoadCliLst, app.onError,app.dbPostLoadCliLst);
    },    
    refreshCliList: function(){
      console.log('refreshCliList');
      app.db.transaction(app.dbLoadCliLst, app.onError,app.dbPostLoadCliLst);
    },    
    dbLoadCliLst: function(tx){
      console.log('dbLoadCliLst');
      var lat=-25.25856,lon=-57.57301;
      var filt='';
      var order='NOMBRE';
      var params=[];
      var sql;
      try{
	lon=app.geoPos.coords.longitude;
	lat=app.geoPos.coords.latitude;
	console.log('  origen posic. actual');
      }catch(e){
	console.log('  origen predefinido');
      }
      //aprox 111195mts x grado (lat o long)
      //aprox 0.005 555mts
      if(app.cliFilter==='CERCANOS'){
	filt="abs(ZZ_LON - ?)<=0.005 and abs(ZZ_LAT - ?)<=0.005";
	params.push(lon);
	params.push(lat);
      }else if(app.cliFilter==='VISITADOS'){
	filt="ZZ_MODIFIED like '%VIS%'";
      }else if(app.cliFilter==='MODIFICADOS'){
	filt="ZZ_MODIFIED like '%MOD%'";
      }else if(app.cliFilter==='TODOS'){
	filt='';
      }else {
      }
      sql='SELECT ID_CLIENTE,NOMBRE,DIRECCION,ZZ_MODIFIED FROM cliente '
      if(filt>''){
	sql=sql+' WHERE '+filt;
      }	    
      sql=sql+' ORDER BY '+order;	
      console.log('  SQL '+sql);
      tx.executeSql(sql,params,app.dbOnLoadCliLst,app.onError);    
    },
    dbOnLoadCliLst: function(tx, results){
	//$.mobile.showPageLoadingMsg(true);
	var len = results.rows.length;
	console.log('dbOnLoadCliLst '+len);
	//$("#lstCli").listview();
	//+' '+row.dstx+','+row.dsty
	$("#lstCli").empty();
	for (var i=0; i<len; i++){
	    var row= results.rows.item(i);
	    //console.log('   ID_CLIENTE '+ row.ID_CLIENTE + ' ' +row.NOMBRE);
	    //var htmlData = '<li onClick="app.onCliSelect('+row.ID_CLIENTE+')" ><a href="#"><h2>'+row.NOMBRE+'</h2><p id="'+row.ID_CLIENTE+'" class="ui-li-aside">'+row.DIRECCION+'<br>'+row.ZZ_MODIFIED+'</p></a></li>';
	    var htmlData = '<li onClick="app.onCliVenta('+row.ID_CLIENTE+')" id="cli.'+row.ID_CLIENTE+'"><a href="#"><h2>'+row.NOMBRE+'</h2><p id="'+row.ID_CLIENTE+'" class="ui-li-aside">'+row.DIRECCION+'<br>'+row.ZZ_MODIFIED+'</p></a></li>';
	    //var htmlData = '<li id="'+row.ID_CLIENTE+'"><a href="#"><h2>'+row.ID_CLIENTE+'</h2><p class="ui-li-aside">'+row.ID_CLIENTE+'</p></a></li>';
	    console.log(htmlData);
	    //var htmlData = '<li "><a href="#" data-role="button" data-inline="true">'+row.NOMBRE+'</a><a href="#" data-role="button" data-inline="true">Modif</a><a href="#"><p id="'+row.ID_CLIENTE+'" class="ui-li-aside">'+row.DIRECCION+'<br>'+row.ZZ_MODIFIED+'</p></a></li>';
	    $("#lstCli").append(htmlData);
	}
	//
	//$(document).off('click', '#lstCli li a', app.onCliSelect);	
	//$(document).on('click', '#lstCli li a', app.onCliSelect);	
	try{ 
	  document.getElementById('synCli').innerHTML ="Sincronizado";      
	}catch(err){
	  console.log('.dbOnLoadCliLst() '+err.message)	  
	}
	//app.Run();
    },
    dbPostLoadCliLst: function(){
	console.log('dbPostLoadCliLst');
	try {
	  $('#lstCli').listview();
	}catch(err){
	  console.log('.listview() '+err.message)	  
	}
	console.log('refresh...1');
	try {
	  $('#lstCli').listview('refresh');
	}catch(err){
	  console.log('.listview(refresh) '+err.message)	  
	}
	console.log('refreshed!');
        
	$( "#lstCli" ).on( "taphold",   
	function ( event ){
	  //$( event.target ).addClass( "taphold" );
	  	console.log('tapholdHandler '+event.target);
		var myItem = $(event.target).closest('li');
		if( !myItem.hasClass('ui-li-divider') ){
		  console.log('tapholdHandlerId '+myItem.attr('id'));
		  if(myItem.attr('id').search("cli.")>=0)
		    app.onCliSelect(myItem.attr('id').substr(4));
		}
	});
	
	//$(document).on('click', '#lstCli li a', app.onCliSelect);	
	//document.getElementById('synCli').innerHTML ="Sincronizado";      
        //$.mobile.changePage($("#pCli"), {});     
	//$.mobile.changePage($("#menu"), { });
	//app.Run();

    },
   
    onCliVenta: function(e){
      console.log('onCliVenta');
      console.log('  e '+ e);
      app.cliente=e+'';
      app.ticket='';
      app.factura='';
      //cargar lista de clientes     
      //$.mobile.changePage($("#pCliEdit"), {});
      app.db.transaction(app.dbLoadCli, app.onError, 
	function(){
	  if(parseInt(app.cliData.PREVTA)>0){
	   //preguntar por las preventas
	   var r=confirm("Entregar VENTAS previas?");
	   if (r==true){
	      //var sql='SELECT * FROM preventa WHERE ID_CLIENTE='+app.cliData;
	      //------------------------
	      console.log('preventa');
	      app.db.transaction(
		//populateDB
		function(tx){
		    console.log('dbSelectPreventa');
		    var params=[app.cliData.ID_CLIENTE];
		    var sql;
		    var acum=0;
		    
		    sql="SELECT p.* FROM preventa p WHERE p.ID_CLIENTE=?  and p.ID_VENTA not in (select e.ID_VENTA from evento e where e.EVENTO='VTA.ENTR' and e.ID_VENTA=p.ID_VENTA)";
		    console.log('  SQL '+sql);
		    tx.executeSql(sql,params,
			function(tx, results){
			    var len = results.rows.length;
			    var htmlData;
			    for (var i=0; i<len; i++){
				//var rows=[];
				app.regEv('VTA.ENTR',app.cliData.ID_CLIENTE,app.cliData.ID_CLI_DEVICE,undefined,undefined,results.rows.item(i).ID_VENTA);
				console.log("Row = " + i + " ID = " + results.rows.item(i).ID_VENTA + " cliente =  " + results.rows.item(i).NOMBRE);
			    }
			}
			,app.onError
		  );
		}    
		,app.onError
		,function(){ console.log('preventa entregada')}
		
	      );	     
	      //-------------------------
	   }else{
	      app.venta();
	   } 
	  }else{
	    app.venta();
	  }
	  
	});//app.onCliSelected
      
    },

    onEditVenta: function(tkt,fac,cli){
      console.log('onEditVenta');
      console.log('  tkt '+ tkt +'  cli '+ cli+ ' fac '+fac);
      app.cliente=cli+'';
      app.ticket=tkt;
      app.factura=fac+'';
      //cargar lista de clientes     
      //$.mobile.changePage($("#pCliEdit"), {});
      app.db.transaction(app.dbLoadCli, app.onError, app.venta);//app.onCliSelected
      
    },
   
    onCliSelect: function(e){
      console.log('onCliSelect');
      console.log('  e '+ e);
      app.cliente=e+'';
      //cargar lista de clientes
      $.mobile.changePage($("#pCliEdit"), {});     
      app.db.transaction(app.dbLoadCli, app.onError,app.onCliSelected);
    },
    onCliSelected: function(e){
      console.log('onCliSelected');
      console.log('   selectmenu ' );
      console.log('   refresh ' );
      $('#tnID_CIUDAD').selectmenu();     
      $('#tnID_CIUDAD').selectmenu();
      $('#tnID_BARRIO').selectmenu();
      $('#tnID_DISTRITO').selectmenu();
      $('#tnID_ZONA').selectmenu();
      $('#tnID_TIPO_CLIENTE').selectmenu();
      $('#tnID_GRUPO_CLIENTE').selectmenu();
      $('#tnID_PROMOTOR').selectmenu();
      $('#tnID_SUPERVISOR').selectmenu();
      $('#tnTIPO_VENTA').selectmenu();
      $('#tnGENERA_IVA').selectmenu();
      /*
      console.log('   refresh ' );
      $('#tnID_CIUDAD').selectmenu("refresh");     
      $('#tnID_CIUDAD').selectmenu().selectmenu("refresh");
      $('#tnID_BARRIO').selectmenu().selectmenu("refresh");
      $('#tnID_DISTRITO').selectmenu().selectmenu("refresh");
      $('#tnID_ZONA').selectmenu().selectmenu("refresh");
      $('#tnID_TIPO_CLIENTE').selectmenu().selectmenu("refresh");
      $('#tnID_GRUPO_CLIENTE').selectmenu().selectmenu("refresh");
      $('#tnID_PROMOTOR').selectmenu().selectmenu("refresh");
      $('#tnID_SUPERVISOR').selectmenu().selectmenu("refresh");
      $('#tnTIPO_VENTA').selectmenu().selectmenu("refresh");
      */
    },
    Run: function(){
      //dispositivo habilitado 
      //desplegar menu
      console.log('Run!');
      //$('#cfg.id').empty().append('Mutti ID: ' + cfg['ID']);
      //$('#lstCli').listview();
      //app.once=app.once+'x';
      //document.getElementById('cfg.id').innerHTML ='Mutti ID: ' + app.cfg['ID'];
      $('#btCli').removeClass('ui-disabled');
      $('#btRem').removeClass('ui-disabled');
      $('#btCierre').removeClass('ui-disabled');
      $('#btSync').removeClass('ui-disabled');
      $("body").fadeIn(5000);
      //$.mobile.loading( "hide" );
      //navigator.splashscreen.hide();
      //Sync
      //app.Sync();
      //enviar cliente nuevos/actualizados
      //recibir clientes e ids del servidor
    },
    onExit: function(){
      navigator.app.exitApp();
    },
    onGeo: function(){
      //buscar inicializacion desde el servidor
      console.log('Geo');
      $.mobile.changePage($("#pGeo"), { });
    },
    Sync: function(){
      //buscar inicializacion desde el servidor
      console.log('Sync');
      $.mobile.changePage($("#pSync"), { });
      $.mobile.loading( "show" );
      document.getElementById('synCli').innerHTML ="Sincronizando...";
      document.getElementById('synEv').innerHTML ="";
      app.devCliErr='';
      app.devCliOk=0;
      app.srvURL='';
      // Create a deferred object
      //var dfd = $.Deferred();
      app.getSrvUrl( function (srvUrl) {
	  var url=srvUrl+'&e=sync';
	  console.log('after  url '+url);
	  //ajax call to server
	  $.getJSON(url, app.onSrvData)
	    .fail(app.onSrvFail)
	    .always(app.onSrvAlways);
	}
      );
      // Add handlers to be called when dfd is resolved
    },
    dbSyncStep: function(tx){
      console.log('  dbSyncStep '+app.syncData.cmds.length);
      for( var i =0;i< app.syncData.cmds.length;i++){
	console.log('  cmd '+app.syncData.cmds[i].CMD);
	tx.executeSql(app.syncData.cmds[i].CMD);     
      }
      //enviar datos
      app.db.transaction(app.dbSyncSend, app.onError);
      //app.db.transaction(app.dbSyncEv, app.onError);
    },
    dbSyncHCli: function(tx){
      console.log('  dbSyncHCli ');
      for( var i =0;i< app.syncData.cmds.length;i++){
	//console.log('  cmd '+app.syncData.cmds[i].CMD);
	tx.executeSql(app.syncData.cmds[i].CMD);     
      }
    },
    dbSyncSend: function(tx){
      console.log('dbSyncSend');
      //validar los datos 
      //guardar
      document.getElementById('synCli').innerHTML ="Sincronizando Exportando Clientes...";
      tx.executeSql("select * FROM cliente WHERE ZZ_MODIFIED > '' or ID_CLIENTE is null",[],app.onSyncSend);
    },
    onSyncSend: function(tx, results) {
        var len = results.rows.length;
	var srvData;
        console.log("Clientes -> host: " + len );
	app.devCliCnt=len;
	app.devCliOk=0;
        for (var i=0; i<len; i++){
            //console.log("Row = " + i + " ID = " + results.rows.item(i).ID_CLIENTE + " cliente =  " + results.rows.item(i).NOMBRE);
	    $.getJSON(app.srvURL+'&e=devCli',results.rows.item(i),app.onSrvData)
	      .fail(app.onSrvFail)
	      .always(app.onSrvAlways);
        }
        if(len==0){
	  app.onSrvData({e:'devCli',msg:'Sin Clientes'});
	}
    },
    dbSyncEv: function(tx){
      console.log('dbSyncSend');
      //validar los datos 
      //guardar
      document.getElementById('synCli').innerHTML ="Sincronizando Exportando Eventos...";
      tx.executeSql("select rowid,* FROM evento ORDER BY fecha",[],app.onSyncEv);
    },
    onSyncEv: function(tx, results) {
        var len = results.rows.length;
        console.log("Eventos -> host: " + len + ' ' + app.srvURL );
	
	app.devEvCnt=len;
	app.devEvOk=0;
	for(j=0;j<len;j+=100){
	  var rows=[];
	  for (var i=0; i<Math.min(100,len - j) ; i++){
	      //console.log("Row = " + i + " ROWID = " + results.rows.item(i).rowid + " ev =  " + results.rows.item(i).EVENTO);
	      rows.push(results.rows.item(j+i));
	  } 
	  //console.log("Rows = " +JSON.stringify(rows));
	  
	  //for (var i=0; i<len; i++){
	      //console.log("Row = " + i + " ROWID = " + results.rows.item(i).ROWID + " ev =  " + results.rows.item(i).EVENTO);
	      
	      $.post(app.srvURL+'&e=devEv', {rows: rows}, app.onSrvData, 'json')
		.fail(app.onSrvFail)
		.always(app.onSrvAlways);
	      /*	    
	      $.getJSON(app.getSrvUrl()+'&e=devEv',{rows: rows},app.onSrvData)
		.fail(app.onSrvFail)
		.always(app.onSrvAlways);
	    */   
	  //}
	}
        if(len==0){
	  app.onSrvData({e:'devEv',msg:'Sin Eventos'});
	}
    },
    onSyncEnd: function(){
      console.log('onSyncEnd');
      //app.db.transaction(app.dbLoadCliLst, app.onError,app.dbPostLoadCliLst);
      document.getElementById('synCli').innerHTML ="Sincronizado";      
      app.refreshCliList();
      console.log('refresh cbx' );
      $('#tnID_CIUDAD').selectmenu("refresh");     
      $('#tnID_CIUDAD').selectmenu().selectmenu("refresh");
      $('#tnID_BARRIO').selectmenu().selectmenu("refresh");
      $('#tnID_DISTRITO').selectmenu().selectmenu("refresh");
      $('#tnID_ZONA').selectmenu().selectmenu("refresh");
      $('#tnID_TIPO_CLIENTE').selectmenu().selectmenu("refresh");
      $('#tnID_GRUPO_CLIENTE').selectmenu().selectmenu("refresh");
      $('#tnID_PROMOTOR').selectmenu().selectmenu("refresh");
      $('#tnID_SUPERVISOR').selectmenu().selectmenu("refresh");
      $('#tnTIPO_VENTA').selectmenu().selectmenu("refresh");  
      $('#tnGENERA_IVA').selectmenu().selectmenu("refresh"); 
    },
    saveCli: function(){
      console.log('saveCli');
      //validar los datos 
      //guardar
      app.db.transaction(app.dbSaveCli, app.onError, app.onSavedCli);
    },
    dbSaveCli: function(tx){
      console.log('dbSaveCli');
      var upd='';
      var whe='';
      var sql='';
      if(app.cliData.ZZ_MODIFIED.indexOf("MODIFICADO") == -1){
	app.cliData.ZZ_MODIFIED=app.cliData.ZZ_MODIFIED+' MODIFICADO ';
      }
      for (var k in app.cliData) {
	var item=$('#tn'+k)
	if(item){
	  var v=item.val();
	  if(k=='ID_CLIENTE'){
    	    whe=k+"='"+v+"'";    
	  }else if(k!='ID_REPARTIDOR' && k.substr(0,3)!='ZZ_' && !(String(v) === 'undefined')  ){
	    upd=upd+','+k+"='"+v+"'";
	  }
	}
      }
      sql="UPDATE cliente SET "+upd.substring(1)+ ",ZZ_MODIFIED=trim(?) WHERE "+whe;
      console.log('SQL '+sql);
      tx.executeSql(sql,[app.cliData.ZZ_MODIFIED]);
      app.regEv('CLI.SAVE',app.cliData.ID_CLIENTE,app.cliData.ID_CLI_DEVICE);
    },
    visitado: function(){
      console.log('visitado');
      //validar los datos 
      //guardar
      app.db.transaction(app.dbVisitado, app.onError, app.onSavedCli);
    },
    dbVisitado: function(tx){
      console.log('dbVisitado');
      var sql='';
      if(app.cliData.ZZ_MODIFIED.indexOf("VISITADO") == -1){
	app.cliData.ZZ_MODIFIED=app.cliData.ZZ_MODIFIED+' VISITADO ';
      }
      var params=[
	app.cfg['ID']
	,app.geoPos.coords.latitude
	,app.geoPos.coords.longitude
	,app.geoPos.coords.accuracy
	,app.geoPos.coords.speed
	,app.geoPos.timestamp
	,app.cliData.ZZ_MODIFIED
	,app.cliData['ID_CLIENTE']
	];
      sql='UPDATE cliente SET ZZ_DEVICE=?,ZZ_LAT=?,ZZ_LON=?,ZZ_PREC=?,ZZ_SPEED=?,ZZ_FECHA=?,ZZ_MODIFIED = trim(?) WHERE ID_CLIENTE=?';
      console.log('SQL '+sql);
      console.log('PARAMS '+params);
      tx.executeSql(sql,params);
      app.regEv('CLI.VISIT',app.cliData.ID_CLIENTE,app.cliData.ID_CLI_DEVICE);
    },
    newCli: function(){
      console.log('newCli');
      app.cfg["LID"]=parseInt(app.cfg["LID"])+1;
      app.db.transaction(app.dbSaveCfg, app.onError,app.newCli2);
      //app.db.transaction(app.dbNewCli, app.onError,app.dbPostNewCli);
    },    
    newCli2: function(){
      console.log('newCli2');
      //app.cfg["LID"]=parseInt(app.cfg["LID"])+1;
      //app.db.transaction(app.dbSaveCfg, app.onError,);
      app.db.transaction(app.dbNewCli, app.onError,app.onPostNewCli);
    },    
    dbNewCli: function(tx){
      console.log('dbNewCli '+app.cfg["LID"] );      
      tx.executeSql("INSERT INTO cliente (ID_CLIENTE,NOMBRE,DIRECCION, ZZ_ID_CLI_DEVICE, ZZ_MODIFIED,ID_REPARTIDOR, ID_ZONA,ID_TIPO_CLIENTE,ID_GRUPO_CLIENTE,ID_PROMOTOR,ID_CIUDAD,ID_BARRIO,ID_DISTRITO,ID_SUPERVISOR,TIPO_VENTA,GENERA_IVA,ZZ_DEVICE,ZZ_LAT,ZZ_LON,ZZ_PREC,ZZ_SPEED,ZZ_FECHA) values (?,?,?,?,'NUEVO',?,1,2,1,1,1,1,1,1,'CONTADO','NO',?,?,?,?,?,?)"
	,[app.cfg["LID"]+'',app.cfg["LID"]+' Nuevo','---',app.cfg["LID"],app.cfg["ID_REPARTIDOR"]
	,app.cfg['ID']
	,app.geoPos.coords.latitude
	,app.geoPos.coords.longitude
	,app.geoPos.coords.accuracy
	,app.geoPos.coords.speed
	,app.geoPos.timestamp  
	]);
    },
    onPostNewCli: function(tx){
      console.log('onPostNewCli '+app.cfg["LID"]+'');
      app.onCliSelect(app.cfg["LID"]+'');
    },
    onSavedCli: function(){
      console.log('onSavedCli');
      $( '#'+app.cliData.ID_CLIENTE, '#pCli').html(app.cliData.DIRECCION+'<br>'+app.cliData.ZZ_MODIFIED);
      //$('#lstCli').listview('refresh');
      app.refreshCliList();
      $.mobile.changePage($("#pCli"), { });
    },
    dbLst: function(tx){
      tx.executeSql('SELECT * FROM codigo order by tbl,descr',
	[],
	function(tx,results){
	  var len = results.rows.length;
	  var tbl='',items='';
	  if(len){
	    tbl=results.rows.item(0).tbl;  
	    for (var i=0; i<len; i++){
	      //$('#location').append('<option value="'+results.rows.item(i).ID+'" class="dropDownBlk">'+results.rows.item(i).lTitle+'</option>');
	      if(tbl==results.rows.item(i).tbl){
		items=items+'<option value="'+results.rows.item(i).codigo+'">'+results.rows.item(i).descr+'</option>';
	      }else{
		app.lst[tbl]=items;
		items='<option value="'+results.rows.item(i).codigo+'" >'+results.rows.item(i).descr+'</option>';
		tbl=results.rows.item(i).tbl;
	      }
	    }
	    app.lst[tbl]=items;
	  }
	  /*
	  $('#tnID_CIUDAD').html('<option>Ciudad</option>'+app.lst['ciudad']);
	  $('#tnID_BARRIO').html('<option>Barrio</option>'+app.lst['barrio']);
	  $('#tnID_DISTRITO').html('<option>Distrito</option>'+app.lst['distrito']);
	  $('#tnID_ZONA').html('<option>Zona</option>'+app.lst['zona']);
	  $('#tnID_TIPO_CLIENTE').html('<option>Tipo</option>'+app.lst['tcliente']);
	  $('#tnID_GRUPO_CLIENTE').html('<option>Grupo</option>'+app.lst['gcliente']);
	  $('#tnID_PROMOTOR').html('<option>Promotor</option>'+app.lst['promotor']);
	  $('#tnID_SUPERVISOR').html('<option>Supervisor</option>'+app.lst['supervisor']);
	  $('#tnTIPO_VENTA').html('<option>Venta</option><option value="CONTADO">Contado</option><option  value="CREDITO">CREDITO</option>');
          */
	  $('#tnID_CIUDAD').html(''+app.lst['ciudad']);  
	  $('#tnID_BARRIO').html(''+app.lst['barrio']);
	  $('#tnID_DISTRITO').html(''+app.lst['distrito']);
	  $('#tnID_ZONA').html(''+app.lst['zona']);
	  $('#tnID_TIPO_CLIENTE').html(''+app.lst['tcliente']);
	  $('#tnID_GRUPO_CLIENTE').html(''+app.lst['gcliente']);
	  $('#tnID_PROMOTOR').html(''+app.lst['promotor']);
	  $('#tnID_SUPERVISOR').html(''+app.lst['supervisor']);
	  $('#tnTIPO_VENTA').html('<option value="CONTADO">Contado</option><option  value="CREDITO">CREDITO</option>');
	  $('#tnGENERA_IVA').html('<option value="NO">NO</option><option  value="SI">SI</option>');
	},
	app.onError
      );      
    },
    startGeoPos: function () {
      // call this once
      
      setupWatch(4000);
      // sets up the interval at the specified frequency
      function setupWatch(freq) {
	  // global var here so it can be cleared on logout (or whenever).
	  activeWatch = setInterval(watchLocation, freq);
      }
      // this is what gets called on the interval.
      function watchLocation() {
	  app.tick++;
	  var gcp = navigator.geolocation.getCurrentPosition(app.onGeoLocation, app.onGeoLocationFail, { maximumAge: 2000, timeout: 5000, enableHighAccuracy: true});
	// console.log(gcp);
      }
      
      //var options = { frequency: 3000, maximumAge: 5000, timeout: 5000, enableHighAccuracy: true };
      var gcp = navigator.geolocation.getCurrentPosition(app.onGeoLocation,  app.onGeoLocationFail, { maximumAge: 2000, timeout: 5000, enableHighAccuracy: true});
      //app.watchID = navigator.geolocation.watchPosition(app.onGeoLocation, app.onGeoLocationFail, { frequency: 1000, maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });
      
    },
    filter: function(fname){
      app.cliFilter=fname;
      app.refreshCliList();
    },
    imgUpload: function (imageURI,iname, id_cliente) {
	console.log('imgUpload '+iname);
	var ft = new FileTransfer(),options = new FileUploadOptions();

	options.fileKey = "file";
	options.fileName = iname; // We will use the name auto-generated by Node at the server side.
	options.mimeType = "image/jpeg";
	options.chunkedMode = false;
	options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
	    id_cliente: id_cliente
	    ,iname: iname
	};
	ft.upload(imageURI, app.srvURL+'&e=devPic',app.onImgUploaded,app.onError, options);
    },
    onImgUploaded: function (r) {
	//uploado Ok
	console.log('onImgUploaded');
	//console.log("   Code = " + r.responseCode);
	//console.log("   Response = " + r.response);
	//console.log("   Sent = " + r.bytesSent);
	if(r.response.count){
	  app.onSrvData(eval('('+r.response[1]+')'));
	}else{
	  app.onSrvData(eval('('+r.response+')'));
	}    
    },  
    takePicture: function (e) {
	console.log('takePicture');
	var options = {
	    quality: 45,
	    //targetWidth: 1000,
	    //targetHeight: 1000,
	    destinationType: Camera.DestinationType.FILE_URI,
	    encodingType: Camera.EncodingType.JPEG,
	    sourceType: Camera.PictureSourceType.CAMERA
	};
	navigator.camera.getPicture(app.onTakePicure,app.onError, options);
	return false;
    },
    onTakePicure: function (imageURI) {
	console.log('onTakePicure '+ imageURI);
	//registrar en log
	var iname=imageURI.split('/').pop();
	console.log('  iname '+iname);

	app.regEv('CLI.PICT',app.cliData.ID_CLIENTE,app.cliData.ID_CLI_DEVICE,iname,imageURI);
	//upload(imageURI);
    },
    openRem: function(){
      $.mobile.changePage($("#pRem"), { });
      app.OnOpenRem();
    },
    OnOpenRem: function() {
      console.log('OnOpenRem');
      app.db.transaction(
	function(tx){
	    console.log('dbOpenRem');
	    var params=[];
	    var sql;
	    var acum=0;
	    sql='SELECT r.REMISION_NRO,d.ID_REMITO_DETALLE,d.ID_REMITO,d.PDESCR,d.CANTIDAD_NETA,d.PRECIO,d.TOTAL from rem r,remdet d WHERE d.ID_REMITO=r.ID_REMITO order by d.ID_REMITO_DETALLE ';
	    //console.log('  SQL '+sql);
	    tx.executeSql(sql,params,
		function(tx, results){
		    //$.mobile.showPageLoadingMsg(true);
		    var len = results.rows.length;
		    var htmlData;
		    //console.log('dbOnOpenRem '+len);
		    $("#lstRem","#pRem").empty();
		    for (var i=0; i<len; i++){
			var row= results.rows.item(i);
			//console.log('   '+ row.PDESCR );
			if(i==0){
			  $("#pRemTitle","#pRem").empty().html('Remisión Nº '+row.REMISION_NRO+' ('+row.ID_REMITO+')');
			}
			htmlData = '<li ><a href="#"><h2>'+row.PDESCR+'</h2><p  class="ui-li-aside">'+row.CANTIDAD_NETA+' <br> Gs '+row.PRECIO+' * '+row.CANTIDAD_NETA+' = '+row.TOTAL+'</p></a></li>';
			//console.log(htmlData);
			acum=acum+parseInt(row.TOTAL);
			$("#lstRem","#pRem").append(htmlData);
		    }
		    htmlData = '<li ><a href="#"><h2>TOTAL</h2><p  class="ui-li-aside"> Gs '+acum.toLocaleString()+'</p></a></li>';
		    $("#lstRem","#pRem").append(htmlData);
		    //
		}
		,app.onError
	    );    
      }
      , app.onError
      , function(){ console.log('Rem loaded!'); 
		try {
		  $('#lstRem',"#pRem").listview();
		}catch(err){
		  console.log('.listview() '+err.message)	  
		}
		console.log('refresh...1');
		try {
		  $('#lstRem',"#pRem").listview('refresh');
		}catch(err){
		  console.log('.listview(refresh) '+err.message)	  
		}
		console.log('refreshed!');
      });
	    
    },
    ventaBack: function(){
      if(app.ticket==0){
	$.mobile.changePage($("#pCli"), { });//lista de clientes
	//app.openCli();
      }else{
	app.ticket=0;
	app.closeRem();//cierre
      }
    },
    venta: function(){
      $.mobile.changePage($("#pVenta"), { });
      console.log('venta');
      app.db.transaction(
	function(tx){
	    console.log('dbVenta');
	    var params=[];
	    var sql;
	    if(app.ticket==0){
	      sql="SELECT 0 as CN, IVA,ID_FAMILIA,ID_REMITO_DETALLE,ID_REMITO,ID_PRODUCTO,PDESCR,CANTIDAD_NETA,PRECIO,coalesce((select e.PRECIO from precio_exc e where e.ID_CLIENTE='"+app.cliData['ID_CLIENTE']+"' and e.ID_PRODUCTO=remdet.ID_PRODUCTO),(select p.PRECIO from precio p where P.ID_TIPO_CLIENTE='"+app.cliData['ID_TIPO_CLIENTE']+"' and p.ID_PRODUCTO=remdet.ID_PRODUCTO)) as PRECIOVENTA,(select coalesce(sum(CANTIDAD_NETA),0) from entrdet WHERE ITEM=ID_REMITO_DETALLE) as VENDIDO from remdet  order by ID_REMITO_DETALLE ";
	      //load clidata
	      //load factura
	      app.factura='';
	    }else{
	      sql="SELECT t.CANTIDAD_NETA as CN, rd.IVA,rd.ID_FAMILIA,rd.ID_REMITO_DETALLE,rd.ID_REMITO,rd.ID_PRODUCTO,rd.PDESCR,rd.CANTIDAD_NETA,rd.PRECIO,coalesce((select e.PRECIO from precio_exc e where e.ID_CLIENTE='"+app.cliData['ID_CLIENTE']+"' and e.ID_PRODUCTO=rd.ID_PRODUCTO),(select p.PRECIO from precio p where P.ID_TIPO_CLIENTE='"+app.cliData['ID_TIPO_CLIENTE']+"' and p.ID_PRODUCTO=rd.ID_PRODUCTO)) as PRECIOVENTA,(select coalesce(sum(CANTIDAD_NETA),0) from entrdet WHERE ITEM=rd.ID_REMITO_DETALLE) as VENDIDO from remdet rd,entrdet t where t.TICKET="+app.ticket+" and rd.ID_REMITO_DETALLE = t.ITEM  order by rd.ID_REMITO_DETALLE ";
	      //load clidata
	      //load factura
	    }
	    console.log('  SQL '+sql);
	    tx.executeSql(sql,params,
		function(tx, results){
		    //$.mobile.showPageLoadingMsg(true);
		    var len = results.rows.length;
		    var htmlData ='';
		    var iva_descr='';
		    console.log('dbVenta '+len);
		    $("#fVta",'#pVenta').empty();
		    app.vitems={};
		    app.vdescr={};
		    app.vdescuento={};
		    app.viva={};
		    for (var i=0; i<len; i++){
		        //var descuento=0.0;
			var row= results.rows.item(i);
			var iva='0';
			var descu=0.0;
			console.log('descr   '+ row.PDESCR );
			console.log('pventa   '+ row.PRECIOVENTA );
			if(i==0){
			  $("#pVentaTitle",'#pVenta').empty().html('Venta '+app.cliData.NOMBRE);
			  app.nrem=row.ID_REMITO;
			  htmlData = '<div data-role="fieldcontain">';
			  htmlData = htmlData +'<label for="tnFACT">FACTURA Nº</label>';
			  htmlData = htmlData +'<input id="tnFACT"   name="FACTURA" type="number" value="'+app.factura+'"  />';
			  htmlData = htmlData +'</div>';	
			  $("#fVta",'#pVenta').append(htmlData);
			  
			  htmlData = '<div data-role="fieldcontain">';
			  htmlData = htmlData +'<label for="tnRUC">RUC</label>';
			  htmlData = htmlData +'<input id="tnRUC"   name="RUC" type="text" value="'+app.cliData.RUC+'" disabled />';
			  htmlData = htmlData +'</div>';	
			  $("#fVta",'#pVenta').append(htmlData);
			}
			app.vitems[row.ID_REMITO_DETALLE]=0;
			app.viva[row.ID_REMITO_DETALLE]=0;
			app.vdescr[row.ID_REMITO_DETALLE]=row.PDESCR;
			app.vdescuento[row.ID_REMITO_DETALLE]=0;
			if(row.ID_FAMILIA=='1' && parseFloat(app.cliData.DESCUENTO_EMBUTIDOS)>0.0){
			  descu=app.cliData.DESCUENTO_EMBUTIDOS;
			  app.vdescuento[row.ID_REMITO_DETALLE]=parseFloat(app.cliData.DESCUENTO_EMBUTIDOS);
			}
			if(row.ID_FAMILIA=='2' && parseFloat(app.cliData.DESCUENTO_HAMBURGUESAS)>0.0){
			  descu=app.cliData.DESCUENTO_HAMBURGUESAS;
			  app.vdescuento[row.ID_REMITO_DETALLE]=parseFloat(app.cliData.DESCUENTO_HAMBURGUESAS);
			}
			if(row.ID_FAMILIA=='3' && parseFloat(app.cliData.DESCUENTO_CARNES)>0.0){
			  descu=app.cliData.DESCUENTO_CARNES;
			  app.vdescuento[row.ID_REMITO_DETALLE]=parseFloat(app.cliData.DESCUENTO_CARNES);
			}
			if(row.ID_FAMILIA=='4' && parseFloat(app.cliData.DESCUENTO_MADURADOS)>0.0){
			  descu=app.cliData.DESCUENTO_MADURADOS;
			  app.vdescuento[row.ID_REMITO_DETALLE]=parseFloat(app.cliData.DESCUENTO_MADURADOS);
			}
			console.log(row.PDESCR+' F '+row.ID_FAMILIA+' D '+app.vdescuento[row.ID_REMITO_DETALLE]+' d '+descu);
			//if(app.cliData.GENERA_IVA =='NO'){
			//  iva='0';
			//}
			iva_descr='EXCENTAS';
			if(app.cliData.GENERA_IVA =='SI'){
			  iva=row.IVA;
			  iva_descr='GRAV. '+row.IVA+'%';
			}
			app.viva[row.ID_REMITO_DETALLE]=String(iva+'').trim();
			//console.log('app.vitems '+JSON.stringify(app.vitems));
			//console.log('app.vdescr '+JSON.stringify(app.vdescr));
			htmlData ='<div data-role="fieldcontain">';
			htmlData = htmlData +'<label for="tnITEM">'+row.PDESCR+' Gs.'+row.PRECIOVENTA+' ('+(row.CANTIDAD_NETA - row.VENDIDO)+' )</label>';
			//htmlData = htmlData +'<input id="tnPRODUCTO'+row.ID_REMITO_DETALLE+'" name="ID_PRODUCTO" type="text" value="'+row.ID_PRODUCTO+'" />';
			htmlData = htmlData +'<input id="tnCANT'+row.ID_REMITO_DETALLE+'"  data-inline="true"   name="CANTIDAD_NETA" type="number" value="'+row.CN+'" onChange="app.vtaChange('+row.ID_REMITO_DETALLE+')"/>';
			htmlData = htmlData +'<input id="tnSUBTOTAL'+row.ID_REMITO_DETALLE+'"  data-inline="true" name="SUBTOTAL" type="number" value="0" disabled />';
			htmlData = htmlData +'</div>';
			//htmlData = htmlData +'</div>';
			
			htmlData = htmlData +'<div id="diviva'+row.ID_REMITO_DETALLE+'" data-role="fieldcontain"  >';
			htmlData = htmlData +'<label for="tnIVA'+row.ID_REMITO_DETALLE+'">I.V.A.</label>';
			htmlData = htmlData +'<input id="tnIVA'+row.ID_REMITO_DETALLE+'"   name="IVA" onChange="app.vtaChange('+row.ID_REMITO_DETALLE+')"  value="'+ app.viva[row.ID_REMITO_DETALLE] +'" disabled />';
			htmlData = htmlData +'</div>';
			
			//htmlData = htmlData +'<input id="tnCANTNET'+row.ID_REMITO_DETALLE+'"  name="CANTIDAD_NETA" type="text" value="0" onChange="app.vtaChange('+row.ID_REMITO_DETALLE+')"/>';
			htmlData = htmlData +'<div id="divprecio'+row.ID_REMITO_DETALLE+'" data-role="fieldcontain">';
			htmlData = htmlData +'<label for="tnPRECIO">Precio Gs.</label>';
			htmlData = htmlData +'<input id="tnPRECIO'+row.ID_REMITO_DETALLE+'"   name="PRECIO" type="number" value="'+row.PRECIOVENTA+'" onChange="app.vtaChange('+row.ID_REMITO_DETALLE+')" disabled />';
			htmlData = htmlData +'</div>';
			/*
			htmlData = htmlData +'<div data-role="fieldcontain">';
			htmlData = htmlData +'<label for="tnSUBTOTAL">Subtotal ' + iva_descr + ' Gs.</label>';
			htmlData = htmlData +'<input id="tnSUBTOTAL'+row.ID_REMITO_DETALLE+'"   name="SUBTOTAL" type="number" value="0" disabled />';
			htmlData = htmlData +'</div>';
			*/
			
			htmlData = htmlData +'<div id="divdesc'+row.ID_REMITO_DETALLE+'" data-role="fieldcontain">';
			htmlData = htmlData +'<label for="tnDESCUENTO">Descuento Gs.</label>';
			htmlData = htmlData +'<input id="tnDESCUENTO'+row.ID_REMITO_DETALLE+'"   name="DESCUENTO" type="number" value="0" disabled />';
			htmlData = htmlData +'</div>';

			$("#fVta",'#pVenta').append(htmlData);
			$('#diviva'+row.ID_REMITO_DETALLE,'#pVenta').hide();
			$('#divprecio'+row.ID_REMITO_DETALLE,'#pVenta').hide();
			$('#divdesc'+row.ID_REMITO_DETALLE,'#pVenta').hide();
		    }		    
		    //totalse descuentos excentas,grav5,grav10
		    htmlData = '<div id="divTD0" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTDESC0">TOTAL DESCUENTO Gs.</label>';
		    htmlData = htmlData +'<input id="tnTDESC0"   name="TDESC0" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    htmlData = '<div id="divTD5" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTDESC5">TOTAL DESCUENTO Gs.</label>';
		    htmlData = htmlData +'<input id="tnTDESC5"   name="TDESC5" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    htmlData = '<div id="divTD10" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTDESC10">TOTAL DESCUENTO Gs.</label>';
		    htmlData = htmlData +'<input id="tnTDESC10"   name="TDESC10" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';
		    
		    //totales venta exc,gra5,gra10
		    htmlData = htmlData +'<div id="divT0" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTOTAL0">TOTAL EXCENTAS</label>';
		    htmlData = htmlData +'<input id="tnTOTAL0"   name="TOTAL0" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    htmlData = htmlData +'<div id="divT5" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTOTAL5">TOTAL GRAV. 5%</label>';
		    htmlData = htmlData +'<input id="tnTOTAL5"   name="TOTAL5" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    htmlData = htmlData +'<div id="divT10" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTOTAL10">TOTAL GRAV. 10%</label>';
		    htmlData = htmlData +'<input id="tnTOTAL10"   name="TOTAL10" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    //total iva5,iva10
		    htmlData = htmlData +'<div id="divI5" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnIVA5">I.V.A. 5%</label>';
		    htmlData = htmlData +'<input id="tnIVA5"   name="IVA5" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    htmlData = htmlData +'<div id="divI10" data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnIVA10">I.V.A. 10%</label>';
		    htmlData = htmlData +'<input id="tnIVA10"   name="IVA10" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';
		    
		    
		    //total general
		    htmlData = htmlData +'<div data-role="fieldcontain">';
		    htmlData = htmlData +'<label for="tnTOTAL">TOTAL Gs.</label>';
		    htmlData = htmlData +'<input id="tnTOTAL"   name="TOTAL" type="number" value="0" disabled />';
		    htmlData = htmlData +'</div>';

		    $("#fVta",'#pVenta').append(htmlData);
		    
		    $('#divTD0','#pVenta').hide();
		    $('#divTD5','#pVenta').hide();
		    $('#divTD10','#pVenta').hide();

		    $('#divT0','#pVenta').hide();
		    $('#divT5','#pVenta').hide();
		    $('#divT10','#pVenta').hide();
		    

		    $('#divI5','#pVenta').hide();
		    $('#divI10','#pVenta').hide();

		    $("#fVta",'#pVenta').trigger("create");
		    //
		    for (var i=0; i<len; i++){
		      var row= results.rows.item(i);
		      app.vtaChange(row.ID_REMITO_DETALLE);
		    }
		    
		}
		,app.onError
	    );    
      }
      ,app.onError
      ,function(){ 
	console.log('vta loaded!'); 
      });
      
    },
    vtaChange: function(inum){
	//console.log('vtaChange '+inum);
	if(!app.vtaValidate(inum))
	   return 0;
	var cant=parseFloat($("#tnCANT"+inum,"#pVenta").val());
	var precio=parseFloat($("#tnPRECIO"+inum,"#pVenta").val());
	//var acum=0.0;
	var acumde=0.0;
	var acumd5=0.0;
	var acumd10=0.0;
	var acume=0.0;
	var acum5=0.0;
	var acum10=0.0;
	var iva5=0.0;
	var iva10=0.0;
	//console.log('  cant '+cant);
	//console.log('  precio '+precio);
	//console.log('  subtot '+(cant*precio));
	app.vitems[inum]=cant*precio;
	$("#tnSUBTOTAL"+inum,"#pVenta").val(app.vitems[inum]);
	$("#tnDESCUENTO"+inum,"#pVenta").val(app.vitems[inum]*app.vdescuento[inum]/100.0);
	$("#tnIVA"+inum,"#pVenta").val(app.viva[inum]);
	for (var i in app.vitems) {
	  //acum += app.vitems[i];
	  console.log('iva '+i+' ['+app.viva[i]+']');	  
	  if(app.viva[i]=='5.00'){
	    acum5 += app.vitems[i];
	    acumd5 += Math.round( app.vitems[i]*app.vdescuento[inum]/100.0 );
	    iva5 += Math.round( ( app.vitems[i] - app.vitems[i]*app.vdescuento[inum]/100.0 )*0.047619047619 );
	  }else if(app.viva[i]=='10.00'){
	    acum10 += app.vitems[i];
	    acumd10 += Math.round( app.vitems[i]*app.vdescuento[inum]/100.0 );
	    iva10 += Math.round( ( app.vitems[i] - app.vitems[i]*app.vdescuento[inum]/100.0 )*0.0909090909);
	    //console.log(' iva10 '+(( app.vitems[i] - app.vitems[i]*app.vdescuento[inum]/100.0 )*0.0909090909)+ ' round '+Math.round( ( app.vitems[i] - app.vitems[i]*app.vdescuento[inum]/100.0 )*0.0909090909) );
	    //console.log(' acum iva10 '+iva10);
	  }else{ //excentas
	    acume += app.vitems[i];
	    acumde += Math.round( app.vitems[i]*app.vdescuento[inum]/100.0 );
	  }
	}
	$("#tnTDESC0","#pVenta").val(acumde);	
	$("#tnTDESC5","#pVenta").val(acumd5);	
	$("#tnTDESC10","#pVenta").val(acumd10);	

	$("#tnTDESC","#pVenta").val(acumde+acumd5+acumd10);

	$("#tnIVA5","#pVenta").val(iva5);	
	$("#tnIVA10","#pVenta").val(iva10);	

	
	$("#tnTOTAL0","#pVenta").val(acume - acumde);
	$("#tnTOTAL5","#pVenta").val(acum5 - acumd5);
	$("#tnTOTAL10","#pVenta").val(acum10 - acumd10);
	
	$("#tnTOTAL","#pVenta").val(acume+acum5+acum10 - acumde-acumd5-acumd10);
	
	if(acumde>0)
	  $('#divTD0','#pVenta').show();
	else
	  $('#divTD0','#pVenta').hide();


	if(acumd5>0)
	  $('#divTD5','#pVenta').show();
	else
	  $('#divTD5','#pVenta').hide();
	
	if(acumd10>0)
	  $('#divTD10','#pVenta').show();
	else
	  $('#divTD10','#pVenta').hide();


	if(acume>0)
	  $('#divT0','#pVenta').show();
	else
	  $('#divT0','#pVenta').hide();

	if(acum5>0)
	  $('#divT5','#pVenta').show();
	else
	  $('#divT5','#pVenta').hide();

	if(acum10>0)
	  $('#divT10','#pVenta').show();
	else
	  $('#divT10','#pVenta').hide();		    

	if(iva5>0)
	  $('#divI5','#pVenta').show();
	else
	  $('#divI5','#pVenta').hide();

	if(iva10>0)
	  $('#divI10','#pVenta').show();
	else
	  $('#divI10','#pVenta').hide();		    	
	
    },
    vtaValidate: function(inum){
	console.log('vtaValidate '+inum+ ' '+app.vdescr[inum]);
	var cant=$("#tnCANT"+inum,"#pVenta").val();
	var precio=$("#tnPRECIO"+inum,"#pVenta").val();
	var acum=0;
	//console.log('  cant '+cant);
	//console.log('  precio '+precio);
	//console.log('  subtot '+(cant*precio));
	if(isNaN(cant)){
	  alert(app.vdescr[inum]+' Cantidad no valida. solo digitos y punto decimal');
	  return 0;
	}else if(isNaN(precio)){
	  alert(app.vdescr[inum]+'Precio no valido. solo digitos y punto decimal');
	  return 0;
	}else{
	  if(cant<0){
	    alert(app.vdescr[inum]+'Cantidad no valido. mayor o igual a cero');
	    return 0;
	  }else if(precio<0){
	    alert(app.vdescr[inum]+'Precio no valido. mayor o igual a cero');
	    return 0;
	  }
	}	
	return(1);
    },
    vtaGuardar: function(){
	console.log('vtaGuardar '+app.nrem);
	for (var i in app.vitems) {
	  if(!app.vtaValidate(i))
	    return 0;
	}

	app.db.transaction(
	  function(tx){
	    console.log('dbVenta');
	    if(app.ticket==0){
	    var params=[
	      $("#tnFACT","#pVenta").val()  
	      ,app.cfg['ID']
	      ,app.cliData['ID_CLIENTE']
	      ,$("#tnTOTAL","#pVenta").val()
	      ,app.geoPos.coords.latitude
	      ,app.geoPos.coords.longitude
	      ,app.geoPos.coords.accuracy
	      ,app.geoPos.coords.speed
	      ,app.geoPos.timestamp
	    ];
	      var sql;
	      sql='INSERT INTO entr(ID_REMITO,TICKET,FACTURA,ID_DEVICE,ID_CLIENTE,TOTAL,LAT,LON,PREC,SPEED,FECHA) '
	      sql=sql+'SELECT ID_REMITO,(select coalesce(max(TICKET),0)+1 from entr),?,?,?,?, ?,?,?,?,? from rem ';
	      console.log('  SQL '+sql);
	      //console.log('app.vitems '+JSON.stringify(app.vitems));
	      //console.log('app.vdescr '+JSON.stringify(app.vdescr));
	      tx.executeSql(sql,params,
		  function(tx){
		      console.log('saved vta cab');
			    app.db.transaction(
			      function(tx){
				console.log('dbVenta');
				for (var inum in app.vitems) {
				console.log('  inum '+inum + ' ' + app.vdescr[inum]);
				//console.log('    descuento ['+$("#tnDESCUENTO"+inum,"#pVenta").val() + ']');
				//console.log('    descuento int [' + parseInt($("#tnDESCUENTO"+inum,"#pVenta").val()) + ']');
				var params=[
				  $("#tnCANT"+inum,"#pVenta").val()
				  ,$("#tnPRECIO"+inum,"#pVenta").val()
				  ,$("#tnSUBTOTAL"+inum,"#pVenta").val()
				  //,$("#tnIVA"+inum,"#pVenta").val()
				  ,app.viva[inum]
				  ,$("#tnDESCUENTO"+inum,"#pVenta").val()
				  ,app.geoPos.coords.latitude
				  ,app.geoPos.coords.longitude
				  ,app.geoPos.coords.accuracy
				  ,app.geoPos.coords.speed
				  ,app.geoPos.timestamp
				];
				console.log('params '+JSON.stringify(params));
				var sql;
				//
				sql='INSERT INTO entrdet(ID_REMITO,TICKET,ITEM,ID_PRODUCTO,CANTIDAD_NETA,PRECIO,TOTAL,TIPO_VENTA,DESCUENTO,LAT,LON,PREC,SPEED,FECHA) '
				sql=sql+'SELECT ID_REMITO,(select max(TICKET) from entr),ID_REMITO_DETALLE,ID_PRODUCTO,?,?,?,?,?,?,?,?,?,? from remdet where ID_REMITO_DETALLE=\''+inum+'\'';
				//sql=sql+'SELECT ID_REMITO,(select max(TICKET) from entr),ID_REMITO_DETALLE,ID_PRODUCTO,?,?,?, ?,?,?,?,? from remdet ';
				console.log('  SQL '+sql);
				tx.executeSql(sql,params,
				    function(tx){
					console.log('save vta det');
				    }
				    ,app.onError
				);    
			    }
    
			    }
			    ,app.onError
			    ,function(){
			    //regEv(descr,id_cliente,id_cli_device,img,imgUri,idVenta)  
			    app.regEv('VTA.NEW',app.cliData.ID_CLIENTE,app.cliData.ID_CLI_DEVICE);
			    console.log('vta cab saved!'); 
			  });		    
		  }
		  ,app.onError
	      );
	    }else{
	      //venta ya guardada usar update app.ticket
	    var params=[
	      $("#tnFACT","#pVenta").val()  
	      ,$("#tnTOTAL","#pVenta").val()
	      ,app.geoPos.coords.latitude
	      ,app.geoPos.coords.longitude
	      ,app.geoPos.coords.accuracy
	      ,app.geoPos.coords.speed
	      ,app.geoPos.timestamp
	      ,app.ticket
	    ];
	    console.log('params '+JSON.stringify(params));
	      var sql;
	      sql='UPDATE entr SET FACTURA=?,TOTAL=?,LAT=?,LON=?,PREC=?,SPEED=?,FECHA=? WHERE TICKET=? ';
	      console.log('  SQL '+sql);
	      //console.log('app.vitems '+JSON.stringify(app.vitems));
	      //console.log('app.vdescr '+JSON.stringify(app.vdescr));
	      tx.executeSql(sql,params,
		  function(tx){
		      console.log('saved vta cab');
			    app.db.transaction(
			      function(tx){
				console.log('dbVenta');
				for (var inum in app.vitems) {
				console.log('  inum '+inum + ' ' + app.vdescr[inum]);
				var params=[
				  $("#tnCANT"+inum,"#pVenta").val()
				  ,$("#tnSUBTOTAL"+inum,"#pVenta").val()
				  ,$("#tnIVA"+inum,"#pVenta").val()
				  ,$("#tnDESCUENTO"+inum,"#pVenta").val()
				  ,app.geoPos.coords.latitude
				  ,app.geoPos.coords.longitude
				  ,app.geoPos.coords.accuracy
				  ,app.geoPos.coords.speed
				  ,app.geoPos.timestamp
				  ,app.ticket
				  ,inum
				];
				console.log('params '+JSON.stringify(params));
				var sql;
				//
				sql='UPDATE entrdet SET CANTIDAD_NETA=?,TOTAL=?,TIPO_VENTA=?,DESCUENTO=?,LAT=?,LON=?,PREC=?,SPEED=?,FECHA=? WHERE TICKET=? AND ITEM=? ';
				//sql='INSERT INTO entrdet(ID_REMITO,TICKET,ITEM,ID_PRODUCTO,CANTIDAD_NETA,PRECIO,TOTAL,TIPO_VENTA,DESCUENTO,LAT,LON,PREC,SPEED,FECHA) '
				//sql=sql+'SELECT ID_REMITO,(select max(TICKET) from entr),ID_REMITO_DETALLE,ID_PRODUCTO,?,?,?,?,?,?,?,?,?,? from remdet where ID_REMITO_DETALLE=\''+inum+'\'';
				//sql=sql+'SELECT ID_REMITO,(select max(TICKET) from entr),ID_REMITO_DETALLE,ID_PRODUCTO,?,?,?, ?,?,?,?,? from remdet ';
				console.log('  SQL '+sql);
				tx.executeSql(sql,params,
				    function(tx){
					console.log('save vta det');
				    }
				    ,app.onError
				);    
			    }
    
			    }
			    ,app.onError
			    ,function(){ 
			    //regEv(descr,id_cliente,id_cli_device,img,imgUri,idVenta)  
			    app.regEv('VTA.UPD',app.cliData.ID_CLIENTE,app.cliData.ID_CLI_DEVICE);
			    console.log('vta cab saved!'); 
			  });		    
		  }
		  ,app.onError
	      );
	      
	    }
	}
	,app.onError
	,function(){ 
	  console.log('vta saved!');
	   if(app.ticket==0) 
	     $.mobile.changePage($("#pCli"), { });
	   else{
	     app.ticket=0;
	     app.closeRem();
	   }
      });
	//$("#tnSUBTOTAL"+inum,"#fVta").val(cant*precio);
        //$("#tnTOTAL"+app.nrem,"#fVta").val(acum)
    },
    closeRem: function(){
      $.mobile.changePage($("#pCierre"), { });
      app.OnCloseRem();
    },
    OnCloseRem: function() {
      console.log('OnCloseRem');
	  app.cieOk=0;
	  app.cieCnt=0;
	  app.db.transaction(
	    function(tx){
		console.log('dbOnCloseRem');
		//coalesce((select count(*) from cliente where ZZ_MODIFIED >''),0) as climod 
		var params=[];
		var sql;
		var acum=0;
		sql="SELECT count(*) as climod from cliente where ZZ_MODIFIED >''";
		console.log('  SQL '+sql);
		tx.executeSql(sql,params,
		    function(tx, results){
			var len = results.rows.length;
			console.log('  climod a '+len);
			$("#msg","#pCierre").empty();
			for (var i=0; i<len; i++){
			    var row= results.rows.item(i);
			    console.log(' climod b  ['+ row.climod+']' );
			    if(i==0 && row.climod>0 ){
			      $("#msg","#pCierre").empty().html('Obs: Debe Actualizar antes de realizar el Cierre');
			      $("#btCierre","#pCierre").hide();
			    }else{
			      $("#btCierre","#pCierre").show();
			    }
			}
		    }
		    ,app.onError
		);   
		sql='SELECT r.REMISION_NRO,d.ID_REMITO_DETALLE,d.ID_REMITO,d.PDESCR,d.CANTIDAD_NETA,d.PRECIO,d.TOTAL,(select coalesce(sum(CANTIDAD_NETA),0) from entrdet WHERE ITEM=ID_REMITO_DETALLE) as VENDIDO,(select coalesce(sum(TOTAL),0) from entrdet WHERE ITEM=ID_REMITO_DETALLE) as VENTA from rem r,remdet d where r.ID_REMITO=d.ID_REMITO order by d.ID_REMITO_DETALLE ';
		console.log('  SQL '+sql);
		tx.executeSql(sql,params,
		    function(tx, results){
			//$.mobile.showPageLoadingMsg(true);
			var len = results.rows.length;
			var htmlData;
			//app.cieCnt=app.cieCnt + results.rows.length;
			//console.log('dbOnOpenRem '+len);
			$("#lstCie","#pCierre").empty();
			for (var i=0; i<len; i++){
			    var row= results.rows.item(i);
			    //console.log('   '+ row.PDESCR );
			    if(i==0){
			      $("#pCieTitle","#pCierre").empty().html('Remisión Nº '+row.REMISION_NRO+' ('+row.ID_REMITO+')');
			      app.nrem=row.ID_REMITO;
			    }
			    htmlData = '<li ><a href="#"><h2>'+row.PDESCR+'</h2><p  class="ui-li-aside">'+(row.CANTIDAD_NETA - row.VENDIDO)+' <br> Gs '+row.PRECIO+' * '+(row.CANTIDAD_NETA - row.VENDIDO)+' = '+(row.CANTIDAD_NETA - row.VENDIDO)*row.PRECIO+'</p></a></li>';
			    //console.log(htmlData);
			    acum=acum+parseInt(((row.CANTIDAD_NETA - row.VENDIDO)*row.PRECIO));
			    $("#lstCie","#pCierre").append(htmlData);
			}
			htmlData = 'Devolucion Mercaderias<br>Gs '+acum.toLocaleString()+'';
			$("#tProd","#pCierre").html(htmlData);
			//
		    }
		    ,app.onError
		);   
		var acum=0;
		sql='SELECT r.ID_REMITO,r.TICKET,r.FACTURA,r.ID_CLIENTE,r.TOTAL, c.RUC,c.NOMBRE, coalesce((select count(*) from entrdet),0) as ICANT from entr r,cliente c where c.ID_CLIENTE = r.ID_CLIENTE  order by r.TICKET ';
		console.log('  SQL '+sql);
		tx.executeSql(sql,params,
		  function(tx, results){
		      //$.mobile.showPageLoadingMsg(true);
		      var len = results.rows.length;
		      var htmlData;
		      var acum=0;
		      //console.log('dbOnOpenRem '+len);
		      $("#lstVent","#pCierre").empty();
		      for (var i=0; i<len; i++){
			  var row= results.rows.item(i);
			  //console.log('   '+ row.PDESCR );
			  if(i==0){
			    app.cieCnt=row.ICANT;
			    //$("#pCieTitle","#pCierre").empty().html('Remisión Nº '+row.REMISION_NRO+' ('+row.ID_REMITO+')');
			  }
			  htmlData = '<li ><a href="#" onClick="app.onEditVenta('+row.TICKET+',\''+row.FACTURA+'\','+row.ID_CLIENTE+')" ><h2>'+row.NOMBRE+'</h2><p  class="ui-li-aside"> '+row.FACTURA+'<br> Gs '+row.TOTAL+'</p></a></li>';
			  //console.log(htmlData);
			  acum=acum+parseInt(row.TOTAL);
			  $("#lstVent","#pCierre").append(htmlData);
		      }
		      htmlData = 'Ventas Gs '+acum.toLocaleString()+'';
		      $("#tVent","#pCierre").html(htmlData);
		      //
		  }
		  ,app.onError
	      );	
      }
      , app.onError
      , function(){ 
	         console.log('Cierre loaded!'); 
		try {
		  $('#lstCie',"#pCierre").listview();
		}catch(err){
		  console.log('.listview() '+err.message)	  
		}
		//console.log('refresh...1');
		try {
		  $('#lstCie',"#pCierre").listview('refresh');
		}catch(err){
		  console.log('.listview(refresh) '+err.message)	  
		}
		//console.log('refreshed!');
		//  console.log('Cierre Fact loaded!'); 
		  try {
		    $('#lstVent',"#pCierre").listview();
		  }catch(err){
		    console.log('.listview() '+err.message)	  
		  }
		  //console.log('refresh...1');
		  try {
		    $('#lstVent',"#pCierre").listview('refresh');
		  }catch(err){
		    console.log('.listview(refresh) '+err.message)	  
		  }
		  //console.log('refreshed!');
      });
    },
    cierre: function(){
      var r=confirm('Esta seguro que desea CERRAR VENTAS?');
      console.log('cierre btn '+ r);
      if(!r)
	return;
      app.srvURL='';
      //$.mobile.loading( 'show', { theme: "b", text: "Procesando", textonly: true });
      app.getSrvUrl(function(srvURL){
	var url=srvURL+'&e=cierrecab';
	console.log('  url '+url);
	app.db.transaction(
	  //populateDB
	  function(tx){
	      console.log('dbOnCloseRem');
	      var params=[];
	      var sql;
	      var acum=0;
	      sql="SELECT ID_REMITO,TICKET,coalesce(FACTURA,'') as FACTURA,ID_DEVICE,ID_CLIENTE,TOTAL,  LAT,LON,PREC,COALESCE(SPEED,0) as SPEED,FECHA from entr order by ID_REMITO,TICKET";
	      console.log('  SQL '+sql);
	      tx.executeSql(sql,params,
		  function(tx, results){
		      var len = results.rows.length;
		      var htmlData;
		      app.cieCnt =  results.rows.length;
		      app.cieOk = 0;
		      $.ajaxSetup({async: false});
		      for (var i=0; i<len; i++){
			  var rows=[];
			  rows.push(results.rows.item(i));
			  //console.log("Row = " + i + " ID = " + results.rows.item(i).ID_CLIENTE + " cliente =  " + results.rows.item(i).NOMBRE);
			  //$.post(app.getSrvUrl()+'&e=cierrecab',{rows: rows}, app.onSrvData, 'json')
			  $.getJSON(app.srvURL+'&e=cierrecab',{rows: rows},app.onSrvData)
			    .fail(app.onSrvFail)
			    .always(app.onSrvAlways);
		      }
		      if(len==0){
			  $.getJSON(app.srvURL+'&e=cierre0',{},app.onSrvData)
			    .fail(app.onSrvFail)
			    .always(app.onSrvAlways);
		      }
		      $.ajaxSetup({async: true});
		  }
		  ,app.onError
	    );
	  }    
	  ,app.onError
	  ,function(){ console.log('cierre cab enviado')}
	);
      });	
    },
    cierreDet: function(){
      var url=app.srvURL+'&e=cierredet';
      console.log('  url '+url);
      //ajax call to server
      app.db.transaction(
	//populateDB
	function(tx){
	    console.log('dbOnCloseRemDet');
	    var params=[];
	    var sql;
	    var acum=0;
	  sql="SELECT (select ID_REMITO from rem limit 1) as ID_REMITO,TICKET,ITEM,ID_PRODUCTO,CANTIDAD_NETA,PRECIO,TOTAL,TIPO_VENTA,DESCUENTO, LAT,LON,PREC,COALESCE(SPEED,0) as SPEED,FECHA from entrdet order by TICKET,ITEM";
	  console.log('  SQL '+sql);
	  tx.executeSql(sql,params,
	      function(tx, results){
		  var len = results.rows.length;
		  var htmlData;
		  app.cieCnt =  results.rows.length;
		  app.cieOk = 0;
		  $.ajaxSetup({async: false});
		  for (var i=0; i<len; i++){
		    var rows=[];
		    rows.push(results.rows.item(i));
		      //console.log("Row = " + i + " ID = " + results.rows.item(i).ID_CLIENTE + " cliente =  " + results.rows.item(i).NOMBRE);
		    $.getJSON(app.srvURL+'&e=cierredet',{rows: rows},app.onSrvData)
			.fail(app.onSrvFail)
			.always(app.onSrvAlways);  
		  }
		  $.ajaxSetup({async: true});
		  if(len==0){
		    app.onSrvData({e:'cierredet', success: true, msg:'Sin Ventas det'});
		    /*
		    $.getJSON(app.getSrvUrl()+'&e=cierredet',{ID_REMITO: app.nrem},app.onSrvData)
			.fail(app.onSrvFail)
			.always(app.onSrvAlways);
	            */
		  }
	      }
	      ,app.onError
	  );	    
	}    
	,app.onError
	,function(){ console.log('cierredet fin')}
      );
    },
    borrarEntr: function(){
 	  app.db.transaction(
	    function(tx){
	      //console.log('  dbSyncHCli ');
		console.log('  cmddel ');
		tx.executeSql('DELETE from entrdet');     
		tx.executeSql('DELETE from entr');     
		tx.executeSql('DELETE from remdet');     
		tx.executeSql('DELETE from rem');     
	    }
	    ,app.onError
	    ,function(){
	      console.log('  cmddel ok ');
		$.mobile.changePage($("#menu"), { });
	    }  
	  );      
    }  
};
