
const Candidatos = (() => {
    const candidatos = [];

    function agregar(nombre, color) {
        candidatos.push({ nombre, color, puntos: 0 });
    }

    function eliminar(index) {
        candidatos.splice(index, 1);
    }

    function agregarPuntos(index, puntos) {
        candidatos[index].puntos += puntos;
    }

    function obtenerTodos() {
        return candidatos;
    }

    return {
        agregar,
        eliminar,
        agregarPuntos,
        obtenerTodos
    };
})();


const UI = (() => {
    const pieChart = document.getElementById('pie-chart');

    function mostrarCandidatos() {
        const candidatos = Candidatos.obtenerTodos();
        let html = '';
        candidatos.forEach((candidato, index) => {
            html += `
                <div class="candidato" style="background-color: ${candidato.color}">
                    <span>${candidato.nombre}</span>
                    <button onclick="UI.eliminarCandidato(${index})">Eliminar</button>
                    <button onclick="UI.agregarPuntos(${index}, 1)">+1 Punto</button>
                </div>
            `;
        });
        document.getElementById('candidatos').innerHTML = html;
    }

    function actualizarPieChart() {
        const candidatos = Candidatos.obtenerTodos();
        const totalPuntos = candidatos.reduce((total, candidato) => total + candidato.puntos, 0);
        const porcentajes = candidatos.map(candidato => ({
            nombre: candidato.nombre,
            porcentaje: totalPuntos > 0 ? (candidato.puntos / totalPuntos) * 100 : 0
        }));

        let svgHtml = '';
        let startAngle = 0;
        porcentajes.forEach(candidato => {
            const endAngle = startAngle + (candidato.porcentaje * 360) / 100;
            const path = sectorPath(100, 100, 80, startAngle, endAngle);
            svgHtml += `<path d="${path}" fill="${candidato.color}" />`;
            startAngle = endAngle;
        });

        pieChart.innerHTML = `<svg width="200" height="200">${svgHtml}</svg>`;
    }

    function eliminarCandidato(index) {
        Candidatos.eliminar(index);
        mostrarCandidatos();
        actualizarPieChart();
    }

    function agregarPuntos(index, puntos) {
        Candidatos.agregarPuntos(index, puntos);
        actualizarPieChart();
    }

    function sectorPath(x, y, radius, startAngle, endAngle) {
        const startRadians = (startAngle - 90) * Math.PI / 180;
        const endRadians = (endAngle - 90) * Math.PI / 180;
        const largeArcFlag = endRadians - startRadians <= Math.PI ? 0 : 1;
        const startX = x + radius * Math.cos(startRadians);
        const startY = y + radius * Math.sin(startRadians);
        const endX = x + radius * Math.cos(endRadians);
        const endY = y + radius * Math.sin(endRadians);
        const path = [
            'M', startX, startY,
            'A', radius, radius, 0, largeArcFlag, 1, endX, endY,
            'L', x, y,
            'Z'
        ];
        return path.join(' ');
    }

    return {
        mostrarCandidatos,
        eliminarCandidato,
        agregarPuntos,
        actualizarPieChart 
    };
})();

UI.mostrarCandidatos();
UI.actualizarPieChart(); 
