import { csv, descending, groups } from 'd3';
import { readFileSync } from 'node:fs';
import archieml from 'archieml';

function charlasDataset(rawData) {
	const charlasClean = groups(rawData, (d) => d.Titulo)
		.map((d) => ({
			titulo: d[0],
			ponentes: new Intl.ListFormat('es').format(d[1].map((n) => n.Nombre)),
			curso: d[1][0].Curso,
			tema: d[1][0].Tema,
			fecha: new Date(d[1][0].Fecha)
		}))
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

	const google_spreadsheet =
		'https://docs.google.com/spreadsheets/d/1hPkvrszhubYai9_wbDN-MWowaqom54KLw7p8_GhwJ4s/edit?gid=993396898#gid=993396898';

	const csvUrl = getCsvUrl(google_spreadsheet);
	const data = await csv(csvUrl);

	const archieFile = readFileSync('static/data.txt', 'utf-8');
	const text = archieml.load(archieFile);

	return {
		charlas: charlasDataset(data),
		graficos: data,
		prox: text.prox,
		personas: text.personas,
		recursos: text.recursos
	};
}
