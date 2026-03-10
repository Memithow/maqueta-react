import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { Demo1LightSidebarContent } from '../light-sidebar';

const Demo1DarkSidebarPage = () => {

  return (
    <Fragment>
      <Container>
        Aqui
      </Container>
      <Container>
        <Demo1LightSidebarContent />
      </Container>
    </Fragment>
  );
};

export { Demo1DarkSidebarPage };
