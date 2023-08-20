import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core"
import './box.css'
function InfoBox({title, isRed, cases, total,active, ...props}) {
    return (
        <div  className = {`infoBox ${active && "infoBox--selected"} ${isRed && 'infoBox--red'}`}>
            <Card
            onClick = {props.onClick}
            >
                <CardContent>
                    <Typography color = "textSecondary">
                    {title}
                    </Typography>
                    
                       <h2 className = {`infoBox__cases ${isRed?'infoBox--cases':'infoBox__cases--green'}`} >
                        {cases}
                        </h2> 

                        
                    <Typography className = "infoBox__total" color = "textSecondary">
                    {total}
                    </Typography>

                        
                </CardContent>
            </Card>
        </div>
    )
}


export default InfoBox
