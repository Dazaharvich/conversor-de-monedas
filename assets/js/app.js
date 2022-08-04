let btn = document.querySelector('#btn-buscar');
let resultado = document.querySelector('#resultado');


//Evento click
btn.addEventListener('click', () => {
  let clpInput = document.querySelector('#clp-input').value;
  let selectMoneda = document.querySelector('#elegir-moneda').value;


  if(clpInput == ""){
    alert("Debes ingresar un monto válido")
}else{
    getMonedas(clpInput,selectMoneda);
    renderGrafica(selectMoneda);
}
})

//Request para obtener JSON desde el EndPoint
async function getMonedas(clpInput,selectMoneda){
try{
    const res = await fetch(`https://mindicador.cl/api/${selectMoneda}`);
    const data = await res.json();
    /* console.log(data.serie); */
    
      switch (selectMoneda) {
          case 'dolar':
            if(data.codigo === selectMoneda){
              resultado.innerHTML = `  $${(clpInput/data.serie[0].valor).toFixed(2)} Dólares`;
            }
          break;
          case 'uf':
            if(data.codigo === selectMoneda){
              resultado.innerHTML = `  ${(clpInput/data.serie[0].valor).toFixed(2)} UF`;
            }
          break;
          case 'utm':
            if(data.codigo === selectMoneda){
              resultado.innerHTML = `  ${(clpInput/data.serie[0].valor).toFixed(2)} UTM`;
            }
          break;
    }
    
}catch(e){
    alert(e.message)
}
}

//Grafica


//Render fechas
async function renderGrafica(selectMoneda) {
    
  const res = await fetch(`https://mindicador.cl/api/${selectMoneda}/2022`,);
  const result = await res.json();

  let infoFecha = result.serie.slice(0,10).map((info)=>{
      return info.fecha.replace(/T04:00:00.000Z|T03:00:00.000Z/gi,'');
  })

  let infoValor = result.serie.slice(0,10).map((info)=>{
      return info.valor;
  });


// Creamos las variables necesarias para el objeto de configuración  
  const data = {
    labels: infoFecha.reverse(),
    datasets: [{
      label: 'Historial de Monedas Ultimos 10 días',
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)',
      pointRadius: 5,
      pointBackgroundColor: 'rgb(75,192,192)',
      fill: false,
      data: infoValor.reverse(),
    }]

  }
  // Creamos el objeto de configuración 
  const configData = {
    type: 'line',
    data: data,
    options: {
          plugins: {
              legend: {
                  display: true,
                  labels: {color: 'white'}
              }
          },
          scales: {
              y: {
                  ticks: {color: 'white', beginAtZero: true},
                  grid: {color: 'rgba(255, 255, 255, .2)', borderColor: 'rgba(255, 255, 255, .2)'},
              },
              x: {
                  ticks: {color: 'white', beginAtZero: true},
                  grid: {display: false},
              }
          },
          title: {
              display: true,
              labels: {
                  color: 'white'
              }
      },
          layout: {
              autoPadding: true, 
          }    
    }
   /* return configData; */
    
  }


  const chartDOM = document.getElementById('myChart');
  new Chart(chartDOM, configData);

  /* renderGrafica(); */
}