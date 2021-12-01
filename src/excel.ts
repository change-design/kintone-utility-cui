import * as XLSX from 'xlsx'
import { UpdatingAppViews, UpdateAppView } from './types/view'

export const parseUpdatingAppViewsConfig = (file: string) => {
  // 対象シート取得
  const options = { cellDates: true } // 日付を取得可能とする
  const workbook = XLSX.readFile(file, options)
  const sheetNames = workbook.SheetNames
  const sheet = workbook.Sheets[sheetNames[0]]
  return parse(sheet)
}

const parse = (sheet: XLSX.WorkSheet) => {
  const r = sheet['!ref']
  if (r == null) {
    return { data: null, errors: ['invalid sheet'] }
  }

  const range = XLSX.utils.decode_range(r)
  // const timezoneOffset = 9 // UTCからの差 (+9時間)
  const errors: string[] = []

  // app id
  //TODO validation
  const app = parseAppId(sheet, range)
  const views = parseAppViews(sheet, range)

  const data: UpdatingAppViews = {
    app,
    views,
    revision: -1,
  }

  return { data, errors }
}

const parseAppId = (sheet: XLSX.Sheet, range: XLSX.Range) => {
  const cell = sheet[address(range.s.r, range.s.c + 1)]
  return cell.w
}

const parseAppViews = (sheet: XLSX.Sheet, range: XLSX.Range) => {
  const views: { [key: string]: UpdateAppView } = {}

  let viewIndex = 1
  const startRowOffset = 1
  const startColOffset = 1
  let processingView: UpdateAppView | null = null
  for (let i = range.s.r + startRowOffset; i <= range.e.r; i++) {
    if (processingView === null) {
      const nameCell = sheet[address(i, range.s.c + startColOffset)]
      console.log(nameCell.w)
      processingView = {
        index: viewIndex.toString(),
        type: 'LIST',
        name: nameCell.w as string,
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
      }

      views[processingView.name as string] = processingView
      processingView = null
      viewIndex++
    }
  }

  return views
}

const parseField = (field: string) => {
  const regex = new RegExp('^(.+?)(#([0-9]+)-(昇順|降順))?$')
  const values = field.match(regex)
  if (values) {
    console.log(values[1])
    //TODO
    return { name: values[1], sort: null }
  } else {
    return { name: null, sort: null }
  }
}

const address = (row: number, col: number) => {
  return XLSX.utils.encode_cell({ r: row, c: col })
}