"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button2";
interface BookCardProps {
  title?: string;
  imageSrc?: string;
  width?: number;
  height?: number;
  coverColor?: string;
  coverText?: string;
  children?: React.ReactNode;
  href?: string;
  buttonText?: string;
  buttonClassName?: string;
  onButtonClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  openInNewTab?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  title = "",
  imageSrc = "/images/ebooks/default-book.jpg",
  width = 220,
  height = 300,
  coverColor = "bg-gray-300",
  coverText = "",
  children,
  href,
  buttonText = "",
  buttonClassName = "btn-gradient text-white text-sm md:text-base px-6 md:px-8 py-3 rounded-2xl font-medium transition-transform hover:scale-105",
  onButtonClick,
  openInNewTab = false,
}) => {
  return (
    <StyledWrapper style={{ width: `${width}px` }}>
      <div
        className="book"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="content">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={title || "book image"}
              width={width}
              height={height}
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          )}
        </div>
        <div className={`cover  ${coverColor}`}>
          {coverText ? <p className=" font-heading">{coverText}</p> : null}
        </div>
      </div>

      <div className="actions">
        {href ? (
          <Button asChild className={buttonClassName}>
            <Link
              href={href}
              target={openInNewTab ? "_blank" : undefined}
              rel={openInNewTab ? "noopener noreferrer" : undefined}
            >
              {children ?? buttonText}
            </Link>
          </Button>
        ) : children ?? buttonText ? (
          <Button onClick={onButtonClick} className={buttonClassName}>
            {children ?? buttonText}
          </Button>
        ) : null}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .book {
    position: relative;
    border-radius: 10px;
    width: 220px;
    height: 300px;
    background-color: whitesmoke;
    // -webkit-box-shadow: 1px 1px 12px #000;
    // box-shadow: 1px 1px 12px #000;
    -webkit-transform: preserve-3d;
    -ms-transform: preserve-3d;
    transform: preserve-3d;
    -webkit-perspective: 2000px;
    perspective: 2000px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    color: white;
  }

  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cover {
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-transform-origin: 0;
    -ms-transform-origin: 0;
    transform-origin: 0;
    -webkit-box-shadow: 1px 1px 12px #000;
    box-shadow: 1px 1px 12px #000;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 10px;
    text-align: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .book:hover .cover {
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-transform: rotatey(-80deg);
    -ms-transform: rotatey(-80deg);
    transform: rotatey(-80deg);
  }
  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    font-size: 45px;
    font-weight: 700;
  text-transform: uppercase;

  }
`;

export default BookCard;
