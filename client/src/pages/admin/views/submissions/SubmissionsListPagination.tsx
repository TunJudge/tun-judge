import React from 'react';
import { Icon, Menu, Table } from 'semantic-ui-react';

type Props = {
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const SubmissionsListPagination: React.FC<Props> = ({
  currentPage,
  totalItems,
  setCurrentPage,
}) => (
  <Table.Footer>
    <Table.Row>
      <Table.HeaderCell colSpan="8">
        <Menu floated="right" pagination>
          <Menu.Item as="a" icon onClick={() => currentPage && setCurrentPage(currentPage - 1)}>
            <Icon name="chevron left" />
          </Menu.Item>
          {new Array(Math.ceil(totalItems / 10)).fill(0).map((_, index) => (
            <Menu.Item
              key={`page-${index}`}
              as="a"
              onClick={() => setCurrentPage(index)}
              active={currentPage === index}
            >
              {index + 1}
            </Menu.Item>
          ))}
          <Menu.Item
            as="a"
            icon
            onClick={() =>
              currentPage + 1 < Math.ceil(totalItems / 10) && setCurrentPage(currentPage + 1)
            }
          >
            <Icon name="chevron right" />
          </Menu.Item>
        </Menu>
      </Table.HeaderCell>
    </Table.Row>
  </Table.Footer>
);

export default SubmissionsListPagination;
