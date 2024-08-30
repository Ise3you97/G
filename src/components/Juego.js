import React, { useCallback, useRef, useState } from "react";
import "../CSS/Juego.css";

const numFilas = 30; // Número de filas en la cuadrícula
const numCols = 30; // Número de columnas en la cuadrícula

const cordenadas = [
  // Coordenadas utilizadas para conocer a los vecinos
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

// Función para restablecer el contenido de las celdas a 0
const limpiarGrid = () => {
  const filas = [];
  for (let i = 0; i < numFilas; i++) {
    filas.push(Array.from(Array(numCols), () => 0));
  }
  return filas;
};

// Funcion principal
function Juego() {
  const [grid, setGrid] = useState(() => limpiarGrid()); // Estado encargado del número de celdas
  const [valorR, setValorR] = useState(0.5); // Estado para generación aleatoria de población
  const [poblacion, setPoblacion] = useState(0); // Estado para la población
  const [ejecutando, setEjecutando] = useState(false); // Estado para comprobar si se está ejecutando el juego

  // Función para contar la población actual
  const contarPoblacion = (grid) => {
    return grid.flat().reduce((acc, val) => acc + val, 0); // Cuenta el número de celdas vivas
  };

  // Función para la generación aleatoria de la población
  const valoresRandom = (valorR) => {
    const filas = [];
    for (let i = 0; i < numFilas; i++) {
      filas.push(
        Array.from(Array(numCols), () => (Math.random() > valorR ? 1 : 0))
      );
    }
    setGrid(filas); // Establece las celdas ocupadas aleatoriamente
    setPoblacion(contarPoblacion(filas)); // Actualiza la población
  };

  const runnigRef = useRef(ejecutando); // Referencia mutable para evitar problemas con el estado en el callback
  runnigRef.current = ejecutando;

  // Función para ejecutar las reglas del juego
  const ejecutarSimulacion = useCallback(() => {
    if (!runnigRef.current) {
      return; // Si no está ejecutando, sale de la función
    }

    // Actualiza el estado de la cuadrícula
    setGrid((g) => {
      const newGrid = g.map((filas, rfilas) =>
        filas.map((celdas, rceldas) => {
          let vecinos = 0;
          // Cuenta el número de vecinos vivos alrededor de la celda actual
          cordenadas.forEach(([x, y]) => {
            const newI = rfilas + x;
            const newK = rceldas + y;
            if (newI >= 0 && newI < numFilas && newK >= 0 && newK < numCols) {
              vecinos += g[newI][newK];
            }
          });

          // Reglas del Juego de la Vida
          if (vecinos < 2 || vecinos > 3) {
            // Regla 1: La celda muere por soledad (menos de 2 vecinos) o sobrepoblación (más de 3 vecinos)
            return 0;
          } else if (celdas === 0 && vecinos === 3) {
            // Regla 2: La celda nace por reproducción si está muerta y tiene exactamente 3 vecinos vivos
            return 1;
          }
          // Regla 3: La celda permanece igual si tiene 2 o 3 vecinos vivos
          return celdas;
        })
      );

      setPoblacion(contarPoblacion(newGrid));
      return newGrid;
    });
    setTimeout(ejecutarSimulacion, 100); //Tiemp
  }, []);

  // Función para alternar el estado de una celda
  const estadoCelda = (filas, col) => {
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) =>
        i === filas && j === col ? (cell === 1 ? 0 : 1) : cell
      )
    );
    setGrid(newGrid);
    setPoblacion(contarPoblacion(newGrid)); // Actualiza la población
  };

  return (
    <>
      <div className="Text">
        <h1>Este es mi Juego de la vida</h1>
        <p>Aplicacion construida con React y Css</p>
        <p>El tamaño de la tabla es de 30 x 30</p>
      </div>
      <div className="btg-container">
        <button
          className="btg"
          onClick={() => {
            setEjecutando(!ejecutando);
            if (!ejecutando) {
              runnigRef.current = true;
              ejecutarSimulacion();
            } else {
              runnigRef.current = false;
            }
          }}
        >
          {ejecutando ? "Detener" : "Empezar"}
        </button>
        <button
          className="btg"
          onClick={() => {
            setGrid(limpiarGrid());
            setPoblacion(0);
          }}
        >
          Limpiar
        </button>
        <button
          className="btg"
          onClick={() => {
            valoresRandom(valorR);
          }}
        >
          Generar 
        </button>
        <div className="slider-container">
          <label htmlFor="probability-slider">Probabilidad: {valorR}</label>
          <input
            id="probability-slider"
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            value={valorR}
            onChange={(e) => setValorR(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="poblacion-container">
        <p>Población actual: {poblacion}</p>
      </div>
      <div className="grid-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
          }}
        >
          {grid.map((filas, i) =>
            filas.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => estadoCelda(i, k)}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? "blue" : undefined,
                  border: "solid 1px black",
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Juego;
