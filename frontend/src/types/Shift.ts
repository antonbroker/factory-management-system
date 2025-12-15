export type Shift = {
    _id: string
    date: string        
    startingHour: number | null
    endingHour: number | null
    employees: string[]
}

export type NewShift = {
    date: string        
    startingHour: number | null
    endingHour: number | null
    employees?: string[]
}


  