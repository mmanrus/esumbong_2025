export const getFirstName = (word: any) => {
  const words = word.split(" ")
  const firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return firstName
}