import React from "react";

function SolicitarSecond() {
    return(
        <div className="solicitarSecond">
            <div class="form-group">
                <label for="origen">Punto de origen</label>
                <select id="opciones-origen" name="opciones" required>
                    <option value="opcion1o">Edificio Palmas</option>
                    <option value="opcion2o">Cedro Rosado</option>
                    <option value="opcion3o">Edificio Acacias</option>
                </select>
            </div>

            <div class="form-group">
                <label for="destino">Punto de destino</label>
                <select id="opciones-destino" name="opciones" required>
                    <option value="opcion1d">Edificio Palmas</option>
                    <option value="opcion2d">Cedro Rosado</option>
                    <option value="opcion3d">Edificio Acacias</option>
                </select>
            </div>

            

            <button class="btn">Siguiente</button>
        </div>
    );
}

export default SolicitarSecond;