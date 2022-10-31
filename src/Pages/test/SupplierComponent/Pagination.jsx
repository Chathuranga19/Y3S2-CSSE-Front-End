import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import {Row, Col } from "react-bootstrap";

const PaginationComponent = ({ itemsCount, itemsPerPage, currentPage, setCurrentPage, setindexOfLastItem, setindexOfFirstItem, alwaysShown = true }) => {
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);
  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 1;
  const isCurrentPageLast = currentPage === pagesCount;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstRecord = (indexOfLastItem - itemsPerPage) + 1;
  setindexOfLastItem(indexOfLastItem);
  setindexOfFirstItem(indexOfLastItem - itemsPerPage);

  const changePage = number => {
    if (currentPage === number) return;
    setCurrentPage(number);
  };

  const onPageNumberClick = pageNumber => {
    changePage(pageNumber);
  };

  const onPreviousPageClick = () => {
    changePage(currentPage => currentPage - 1);
  };

  const onNextPageClick = () => {
    changePage(currentPage => currentPage + 1);
  };

  const setLastPageAsCurrent = () => {
    if (currentPage > pagesCount) {
      setCurrentPage(1);
    }
  };

  let isPageNumberOutOfRange;
  const pageNumbers = [...new Array(pagesCount)].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pagesCount;
    const isCurrentPageWithinTwoPageNumbers =
      Math.abs(pageNumber - currentPage) <= 2;

    if (
      isPageNumberFirst ||
      isPageNumberLast ||
      isCurrentPageWithinTwoPageNumbers
    ) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          key={pageNumber}
          onClick={() => onPageNumberClick(pageNumber)}
          active={pageNumber === currentPage}
        >
          {pageNumber}
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return <Pagination.Ellipsis key={pageNumber} className="muted" />;
    }

    return null;
  });

  const lastpage = () => {
    if (indexOfLastItem > itemsCount) {
      return itemsCount;
    }
    else return indexOfLastItem;
  }

  useEffect(setLastPageAsCurrent, [pagesCount]);

  return (

    <div style={{ marginTop: '10px' }}>
      <Row>
        <Col xs={5}/>
        <Col>
          <div style={{color:'grey'}} className="paginationCenter">
            Showing {indexOfFirstRecord} to {lastpage()} of {itemsCount}
          </div>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>

            {isPaginationShown && (
              <Pagination>
                <Pagination.Prev
                  onClick={onPreviousPageClick}
                  disabled={isCurrentPageFirst}
                />
                {pageNumbers}
                <Pagination.Next
                  onClick={onNextPageClick}
                  disabled={isCurrentPageLast}
                />
              </Pagination>
            )}

          </div>
        </Col>
      </Row>
    </div>

  );
};

export default PaginationComponent;