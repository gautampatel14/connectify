import { Document, Page } from 'react-pdf';

export const imageShow = (src, theme) => {
    return(
        <img src={src} alt="images" className="img-thumbnail"
        style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
    )
}

export const videoShow = (src, theme) => {
    return(
        <video controls src={src} alt="video" className="img-thumbnail"
        style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
    )
}

// export const pdfShow = (src,theme)=>{

//     return(

//     <div className="pdf-viewer">
//         <Document file={src}>
//             <Page pageNumber={1} />
//       </Document>
//     </div>
//     )
// }