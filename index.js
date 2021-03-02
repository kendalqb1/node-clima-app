require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');

const main = async () => {

    const busquedas = new Busquedas();
    let opt = 0;

    do {
        console.clear();

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar Mensaje
                const termino = await leerInput('Cuidad: ');

                //Buscar Lugares
                const lugares = await busquedas.cuidad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue; 
                const lugarSel = lugares.find(l => l.id === id);
                
                //Guarda en DB
                busquedas.agregarHistorial(lugarSel.nombre);


                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                console.clear();
                //Mostrar Resultados
                console.log('\nInformacion de la cuidad\n'.green);
                console.log('Cuidad', lugarSel.nombre.green);
                console.log('Latitud: ', lugarSel.lat);
                console.log('Longitud: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Clima: ', clima.desc.green);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar,i) => {
                    const idx = `${i+1}.`.green;
                    console.log( `${idx} ${lugar}`);
                });

                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();
