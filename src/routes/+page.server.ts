import { csv, descending, groups } from 'd3';
import archieml from 'archieml';
import archieRaw from '../../static/data.txt?raw';

function charlasDataset(rawData, descripcionesMap) {
	const charlasClean = groups(rawData, (d) => d.Titulo)
		.map(([titulo, ponentesRaw]) => {
			const extra = descripcionesMap.get(titulo) ?? {};
			return {
				id: titulo,
				titulo,
				ponentes: new Intl.ListFormat('es').format(ponentesRaw.map((n) => n.Nombre)),
				curso: ponentesRaw[0].Curso,
				tema: ponentesRaw[0].Tema,
				fecha: new Date(ponentesRaw[0].Fecha),
				descripcion: extra.descripcion ?? '',
				link: extra.link ?? ''
			};
		})
		.sort((a, b) => descending(a.fecha, b.fecha));

	return charlasClean;
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const getCsvUrl = (url) => {
		url = new URL(url);
		const id = url.pathname.split('/')[3];
		const gid = new URLSearchParams(url.hash.slice(1)).get('gid') || 0;
		return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
	};

	const mainSpreadsheet =
		'https://docs.google.com/spreadsheets/d/1hPkvrszhubYai9_wbDN-MWowaqom54KLw7p8_GhwJ4s/edit?gid=993396898#gid=993396898';
	const descripcionesSpreadsheet =
		'https://docs.google.com/spreadsheets/d/1hPkvrszhubYai9_wbDN-MWowaqom54KLw7p8_GhwJ4s/edit?gid=1791175569#gid=1791175569';

	const [data, descripciones] = await Promise.all([
		csv(getCsvUrl(mainSpreadsheet)),
		csv(getCsvUrl(descripcionesSpreadsheet))
	]);

	const descripcionesMap = new Map(
		descripciones.map((d) => [
			d.Titulo,
			{ descripcion: d['Descripción'] ?? '', link: d.Youtube ?? '' }
		])
	);

	const text = archieml.load(archieRaw);

	return {
		charlas: charlasDataset(data, descripcionesMap),
		graficos: data,
		prox: text.prox,
		personas: text.personas,
		recursos: text.recursos
	};
}
