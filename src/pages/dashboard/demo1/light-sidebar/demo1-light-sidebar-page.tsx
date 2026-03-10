import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { Demo1LightSidebarContent } from './';

export function Demo1LightSidebarPage() {
console.log('Demo1LightSidebarPage');
  return (
    <Fragment>
      <Container>
        aqui
      </Container>
      <Container>
        <Demo1LightSidebarContent />
      </Container>
    </Fragment>
  );
}
