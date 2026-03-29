export const slugifyCourseTopicTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const createCourseTopicSlugMap = <T extends { id: number; title: string }>(items: T[]) => {
  const counts = new Map<string, number>()

  return items.reduce<Record<number, string>>((accumulator, item) => {
    const baseSlug = slugifyCourseTopicTitle(item.title)
    const nextCount = (counts.get(baseSlug) ?? 0) + 1
    counts.set(baseSlug, nextCount)

    accumulator[item.id] = nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`
    return accumulator
  }, {})
}
