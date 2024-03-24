import { Helmet } from "react-helmet-async"


const MetaComponent = ({title , description , keywords}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta name="keywords" content={keywords}/>
    </Helmet>
  )
}

MetaComponent.defaultProps = {
  title: 'Welcome To Zef-Proshop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electroincs',
};

export default MetaComponent;