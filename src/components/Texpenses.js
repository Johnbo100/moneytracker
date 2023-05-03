import React from 'react'

export const Texpenses = (props) => {
  const exreport = props.exreport; 
    return (
    {exreport.map((s) => {
        return (
          <div className='exreport'>
            Date<input placeholder={s.date}/>
            BHT<input placeholder={s.total}/> 
            GBP<input placeholder={s.total * 0.023}/>
          </div>     
        );
      })}
  )
}
