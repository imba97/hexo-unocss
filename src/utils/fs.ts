import fs from 'node:fs'
import path from 'node:path'

export const readFiles = (directory: string | string[]) => {
  const filePaths: string[] = []

  if (Array.isArray(directory)) {
    directory.forEach((dir) => {
      const subDirFilePaths = readFiles(dir)
      filePaths.push(...subDirFilePaths)
    })

    return filePaths
  }

  try {
    const items = fs.readdirSync(directory, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(directory, item.name)

      if (item.isDirectory()) {
        const subDirFilePaths = readFiles(itemPath)
        filePaths.push(...subDirFilePaths)
      } else {
        filePaths.push(itemPath)
      }
    }

    return filePaths
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error)
    return []
  }
}
