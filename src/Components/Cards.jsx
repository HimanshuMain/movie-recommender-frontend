import React from 'react'

import { Link } from 'react-router-dom'
export default function Cards({ data }) {


    return (
     
        <div className="container-card">
            <div className="card">
                <div className="img-outer">  <img src={data.Poster === "N/A" ? "https://th.bing.com/th/id/OIP.Nn37ffqkhJadETMlz1WuWAHaHa?w=160&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" : data.Poster} className='posterClass' alt="..." />
                </div>  <div className="card-body">
                    <h5 className="card-title">{data.Title}</h5>
                    <h4>{data.Year}</h4>
                    <h6>{data.Type}</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <Link to={`/detail/${data.imdbID}`} className="btn btn-primary">Detail</Link>
                </div>
            </div>
        </div>






    )
}
