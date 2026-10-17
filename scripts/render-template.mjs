export function renderTemplate(text, model, typography) {
  return text.replace(/@@(color|alpha|font):([^@]+)@@/g, (_, group, id) => {
    const value = group === 'font' ? typography.roles[id]?.family : model[group === 'color' ? 'colors' : 'alpha'][id];
    if (value === undefined) throw new Error(`Unknown theme ${group}: ${id}`);
    return JSON.stringify(value);
  });
}
