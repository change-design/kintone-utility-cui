import * as XLSX from 'xlsx'
import { UpdatingAppViews, UpdateAppView } from './types/view'

interface SortDefinition {
  index: number
  name: string
  asc: boolean
}

interface Result {
  data: UpdatingAppViews | null
  errors: string[]
}

export const parseUpdatingAppViewsConfig = (file: string): Result => {
  const { sheet, error } = getTargetSheetFromFile(file)
  if (sheet !== null) {
    return parse(sheet)
  } else {
    return { data: null, errors: [error] }
  }
}

const getTargetSheetFromFile = (file: string) => {
  // 対象シート取得
  try {
    const options = { cellDates: true } // 日付を取得可能とする
    const workbook = XLSX.readFile(file, options)
    const sheetNames = workbook.SheetNames

    return { sheet: workbook.Sheets[sheetNames[0]], error: '' }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        sheet: null,
        error: `Excelファイルの読み込みに失敗しました
        ${err.message}`,
      }
    } else {
      return { sheet: null, error: '予期せぬエラーが発生しました' }
    }
  }
}

const parse = (sheet: XLSX.WorkSheet): Result => {
  const r = sheet['!ref']
  if (r == null) {
    return { data: null, errors: ['invalid sheet'] }
  }

  const range = XLSX.utils.decode_range(r)
  // const timezoneOffset = 9 // UTCからの差 (+9時間)

  const app = parseAppId(sheet, range)
  const views = parseAppViews(sheet, range)
  const data: UpdatingAppViews = {
    app,
    views,
    revision: -1,
  }

  const errors = validate(data)

  return { data, errors }
}

const validate = (data: UpdatingAppViews) => {
  const errors: string[] = []
  if (!data.app) {
    errors.push('アプリIDが指定されていません')
  }
  if (data.views === null || Object.keys(data.views).length === 0) {
    errors.push('一覧表定義がありません')
  }
  Object.keys(data.views).forEach((key, index) => {
    if (key == null || key === 'undefined' || key === '') {
      errors.push(`${index + 1}番目: 定義名が指定されていません`)
    }

    const view = data.views[key]
    if (view.fields == null || view.fields.length === 0) {
      errors.push(`${index + 1}番目: フィールドが指定されていません`)
    }
  })

  return errors
}

const parseAppId = (sheet: XLSX.Sheet, range: XLSX.Range) => {
  const cell = sheet[address(range.s.r, range.s.c + 1)]
  return cell?.w
}

const parseAppViews = (sheet: XLSX.Sheet, range: XLSX.Range) => {
  const views: { [key: string]: UpdateAppView } = {}

  let viewIndex = 1
  const startRowOffset = 1
  const startColOffset = 1
  let processingView: UpdateAppView | null = null
  let sortDefinitions: SortDefinition[] = []
  for (let i = range.s.r + startRowOffset; i <= range.e.r; i++) {
    if (processingView === null) {
      const nameCell = sheet[address(i, range.s.c + startColOffset)]
      processingView = {
        index: viewIndex.toString(),
        type: 'LIST',
        name: nameCell?.w as string,
        fields: [],
        sort: '',
      }
    } else {
      for (let j = range.s.c + startColOffset; j <= range.e.c; j++) {
        const fieldCell = sheet[address(i, j)]
        if (fieldCell == null || fieldCell.w === '') {
          break
        }
        const { name, sort } = parseField(fieldCell.w)
        if (name != null) {
          processingView.fields?.push(name)
        }
        if (sort != null) {
          sortDefinitions.push(sort)
        }
      }
      const sortString = sortDefinitions
        .sort((a, b) => {
          if (a.index > b.index) {
            return 1
          } else if (a.index < b.index) {
            return -1
          }
          return 0
        })
        .map((s) => {
          return `${s.name} ${s.asc ? 'asc' : 'desc'}`
        })
        .join(', ')
      processingView.sort = sortString

      views[processingView.name as string] = processingView
      processingView = null
      sortDefinitions = []
      viewIndex++
    }
  }

  return views
}

const parseField = (field: string) => {
  const regex = new RegExp('^(.+?)(#([0-9]+)-(昇順|降順))?$')
  const values = field.match(regex)
  if (values) {
    const name = values[1]
    if (values[3]) {
      const sort: SortDefinition = {
        index: parseInt(values[3], 10),
        name,
        asc: values[4] === '昇順',
      }

      return { name, sort }
    } else {
      return { name, sort: null }
    }
  } else {
    return { name: null, sort: null }
  }
}

const address = (row: number, col: number) => {
  return XLSX.utils.encode_cell({ r: row, c: col })
}
