import { REGIONES, comunasDeRegion } from "../../data/regiones";
import { CampoSelect } from "../comunes/Campos";

interface Props {
  prefijoId: string;
  region: string;
  comuna: string;
  errorRegion?: string;
  errorComuna?: string;
  onRegion: (region: string) => void;
  onComuna: (comuna: string) => void;
}

/**
 * Par de selects dependientes: las comunas disponibles dependen de la región
 * elegida y, al cambiar de región, la comuna se reinicia. Lo reutilizan el
 * registro, el perfil, el formulario de usuarios del panel y el checkout.
 */
export function SelectRegionComuna({ prefijoId, region, comuna, errorRegion, errorComuna, onRegion, onComuna }: Props) {
  return (
    <>
      <div className="col-md-6">
        <CampoSelect id={`${prefijoId}-region`} etiqueta="Región" placeholder="-- Seleccione la región --" valor={region} error={errorRegion}
          opciones={REGIONES.map((r) => ({ valor: r.nombre, etiqueta: r.nombre }))}
          onCambio={(nueva) => {
            onRegion(nueva);
            onComuna("");
          }} />
      </div>
      <div className="col-md-6">
        <CampoSelect id={`${prefijoId}-comuna`} etiqueta="Comuna" placeholder="-- Seleccione la comuna --" valor={comuna} error={errorComuna}
          disabled={region === ""} opciones={comunasDeRegion(region).map((c) => ({ valor: c, etiqueta: c }))} onCambio={onComuna} />
      </div>
    </>
  );
}
