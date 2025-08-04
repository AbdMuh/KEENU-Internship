using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using Task01.Controllers;
using Task01.Model;
using UserApi.Services;
using Xunit;

namespace TestProject.Controllers
{
    public class CardControllerTests
    {

        private readonly Mock<ICardService> _cardServiceMock;
        private readonly CardsController _controller;

        public CardControllerTests()
        {
            _cardServiceMock = new Mock<ICardService>();
            _controller = new CardsController(_cardServiceMock.Object);
        }

        [Fact]
        public void GetAllCards_ReturnsOk()
        {
            int userId = 1;
            var userCards = new List<UserCard>
            {
                new UserCard { Id = 1, UserId = userId, CardNumber = "1234567812345678", HolderName="Muhammad", SetAsDefault = 0, ExpirationDate=DateTime.Now },
                new UserCard { Id = 2, UserId = userId, CardNumber = "8765432187654321", HolderName="Abdullah", SetAsDefault = 1, ExpirationDate=DateTime.Now }
            };

            _cardServiceMock.Setup(s => s.GetAllCards(userId))
                .Returns(userCards);

            var result = _controller.GetAllCards(userId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedCards = Assert.IsAssignableFrom<IEnumerable<UserCard>>(okResult.Value);
            
        }

        [Fact]
        public void GetAllCards_ReturnsNotFound_WhenNoCardsExist()
        {
            int userId = 1;
            _cardServiceMock.Setup(s => s.GetAllCards(userId)).Returns(new List<UserCard>());

            var result = _controller.GetAllCards(userId);

            var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("No cards found for this user.", notFound.Value);
        }

        [Fact] 
        public void AddCard_ReturnsCreated()
        {
            var userCard = new UserCard
            {
                UserId = 1,
                CardNumber = "1234567812345678",
                HolderName = "Test User",
                SetAsDefault = 0,
                ExpirationDate = DateTime.Now
            };
            _cardServiceMock.Setup(s => s.AddCard(userCard))
                .Returns(userCard);

            var result = _controller.AddCard(userCard);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdCard = Assert.IsType<UserCard>(created.Value);
            Assert.Equal("1234567812345678", createdCard.CardNumber);

        }

        [Fact]
        public void UpdateCard_ReturnsBadRequest_IfCardIsNull()
        {
            var result = _controller.UpdateCard(1, null);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid card data.", badRequest.Value);
        }

        [Fact]
        public void UpdateCard_ReturnsOk()
        {
            var card = new UserCard
            {
                Id = 1,
                CardNumber = "1234567890123456",
                HolderName = "John",
                UserId = 1,
                ExpirationDate = DateTime.UtcNow.AddYears(2)
            };

            var result = _controller.UpdateCard(1, card);

            _cardServiceMock.Verify(s => s.UpdateCard(1, card), Times.Once);
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Card updated successfully.", ok.Value);
        }

        [Fact]
        public void SetDefaultCard_ReturnsAlreadyDisplayed_IfSameCardIsAlreadyDefault()
        {
            var cardInfo = new CardInfo { UserId = 1, CardId = 10 };
            var existingCard = new UserCard { Id = 10, SetAsDefault = 1, CardNumber="1212123234323432", HolderName="Muhammad Abdullah", ExpirationDate=DateTime.Now.AddYears(3)};

            _cardServiceMock.Setup(s => s.GetDefaultCard(1)).Returns(existingCard);

            var result = _controller.SetDefaultCard(cardInfo);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("The Card is already on Display", ok.Value);
        }

        [Fact]
        public void SetDefaultCard_UpdatesCard_WhenDifferentCardSelected()
        {
            var cardInfo = new CardInfo { UserId = 1, CardId = 99 };
            var existingCard = new UserCard { Id = 10, UserId = 1, SetAsDefault = 1, CardNumber="1111111111111111" , ExpirationDate=DateTime.Now.AddYears(3), HolderName="Muhammad Abdullah"};

            _cardServiceMock.Setup(s => s.GetDefaultCard(1)).Returns(existingCard);

            var result = _controller.SetDefaultCard(cardInfo);

            _cardServiceMock.Verify(s => s.SetDefaultCard(1, 99), Times.Once);
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Card display preference updated successfully.", ok.Value);
        }
        [Fact]
        public void GetDefaultCard_ReturnsOk()
        {
            int userId = 1;
            var userCard = new UserCard
            {
                Id = 1,
                UserId = userId,
                CardNumber = "1234567812345678",
                HolderName = "Test User",
                SetAsDefault = 1,
                ExpirationDate = DateTime.Now
            };

            _cardServiceMock.Setup(s => s.GetDefaultCard(userId))
                .Returns(userCard);
            var result = _controller.getDefault(userId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<UserCard>(okResult.Value);
        }

    }
}
