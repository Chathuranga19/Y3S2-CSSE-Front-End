import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { Row, Col } from "react-bootstrap";

//get props from the component that pagination added in order to update the state in real time
const PaginationComponent = ({ itemsCount, itemsPerPage, currentPage, setCurrentPage, setindexOfLastItem, setindexOfFirstItem, alwaysShown = true }) => {
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);
  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 1;
  const isCurrentPageLast = currentPage === pagesCount;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstRecord = (indexOfLastItem - itemsPerPage) + 1;

  //change the current page
  const changePage = number => {
    if (currentPage === number) return;
    setCurrentPage(number);
  };

  //trigger when a page number clicked
  const onPageNumberClick = pageNumber => {
    changePage(pageNumber);
  };

  //set previous page
  const onPreviousPageClick = () => {
    changePage(currentPage => currentPage - 1);
  };

  //set next page
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


  //set last page
  const lastpage = () => {
    if (indexOfLastItem > itemsCount) {
      return itemsCount;
    }
    else return indexOfLastItem;
  }

  //executes first and re-render when mentioned parameters changed
  useEffect(() => {
    setLastPageAsCurrent()
    setindexOfLastItem(indexOfLastItem);
    setindexOfFirstItem(indexOfLastItem - itemsPerPage);
  }, [pagesCount, indexOfLastItem, indexOfLastItem])

  return (

    <div style={{ marginTop: '10px' }}>
      <Row>
        <Col xs={5} />
        <Col>

          {/* Show total pages and total records of the page out of total */}

          <div style={{ color: 'grey' }} className="paginationCenter">
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