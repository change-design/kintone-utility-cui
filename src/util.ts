import * as readline from 'readline'

export const prompt = async (
  message: string,
  required = true,
): Promise<string> => {
  console.log(message)

  const result = (await question()) as string
  const answer = result.trim()
  if (answer === '' && required) {
    return prompt(message)
  }

  return answer
}

const question = () => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    readlineInterface.question('> ', (answer) => {
      resolve(answer)
      readlineInterface.close()
    })
  })
}
