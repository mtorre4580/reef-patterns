import type { Pattern } from '../types';

export const mvvm: Pattern = {
  id: 'mvvm',
  rank: 17,
  name: 'MVVM',
  nameEs: 'Modelo-Vista-VistaModelo',
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary:
    'Un ViewModel expone estado y comandos listos para la vista, que se enlaza a ellos de forma declarativa.',
  when: 'Cuando la vista se actualiza por data binding y querés que toda la lógica de presentación (formatos, validaciones, estados derivados) sea testeable sin UI.',
  pros: [
    'La lógica de presentación se testea sin renderizar nada.',
    'La vista queda declarativa y casi sin código.',
    'Encaja con frameworks reactivos.',
  ],
  cons: [
    'El binding bidireccional puede generar actualizaciones difíciles de rastrear.',
    'Para pantallas simples, el ViewModel es una capa extra.',
  ],
  realWorld:
    'Knockout.js, la Options/Composition API de Vue, los ViewModels de Android Jetpack; un hook de React que devuelve estado derivado y handlers cumple el mismo rol.',
  example: {
    title: 'ViewModel del panel de parámetros',
    scenario:
      'La vista del panel solo muestra textos y colores. El ViewModel transforma las lecturas crudas del modelo en etiquetas, estados y un comando para registrar una nueva.',
    code: `// Modelo: datos y reglas del dominio
const model = {
  readings: [{ param: 'kh', value: 6.4 }, { param: 'ca', value: 420 }],
  ranges: { kh: [7, 9], ca: [400, 450] },
};

function createParamsViewModel(model, onChange) {
  const statusOf = ({ param, value }) => {
    const [min, max] = model.ranges[param];
    return value < min ? 'bajo' : value > max ? 'alto' : 'ok';
  };

  return {
    // Estado listo para mostrar: la vista no calcula nada
    get rows() {
      return model.readings.map((r) => ({
        label: r.param.toUpperCase(),
        text: r.value + (r.param === 'kh' ? ' dKH' : ' ppm'),
        status: statusOf(r),
      }));
    },
    get alerts() {
      return this.rows.filter((r) => r.status !== 'ok').length;
    },
    // Comando que la vista enlaza a un botón
    addReading(param, value) {
      model.readings.push({ param, value: Number(value) });
      onChange();
    },
  };
}

const vm = createParamsViewModel(model, () => console.log('Volver a renderizar'));
console.log(vm.rows, vm.alerts); // 1 alerta: KH bajo
vm.addReading('kh', '7.8');`,
  },
  related: ['mvc', 'custom-hooks', 'observer'],
};
