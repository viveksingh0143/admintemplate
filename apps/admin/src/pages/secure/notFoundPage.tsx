import ResourceNotFound from '@assets/images/illustrations/page_not_found.svg';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className='flex justify-center'>
          <ResourceNotFound />
        </div>
        <div className='flex justify-center'>
          <h3 className="mt-20 text-4xl leading-6 text-gray-700">Resource Not Found</h3>
        </div>
      </div>
    </>
  )
};

export default NotFoundPage;