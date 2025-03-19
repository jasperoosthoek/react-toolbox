import { ErrorPage, useLocalization } from '@jasperoosthoek/react-toolbox';

const NoMatchPage = () => {
  const { text } = useLocalization();
  return (
    <ErrorPage>{text`page_not_found`}</ErrorPage>
  )
}

export default NoMatchPage;