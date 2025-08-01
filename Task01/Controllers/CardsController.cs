using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task01.Model;
using UserApi.Services;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardsController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpGet("GetAllCards/{userId}")]

        public ActionResult<IEnumerable<UserCard>> GetAllCards(int userId)
        {
            var userCards = _cardService.GetAllCards(userId);

            if (!userCards.Any())
                return NotFound("No cards found for this user.");

            return Ok(userCards);
        }

        [HttpPost("add")]
        public ActionResult<UserCard> AddCard([FromBody] UserCard userCard)
        {
            if (userCard == null || string.IsNullOrWhiteSpace(userCard.CardNumber))
                return BadRequest("Invalid card data.");

            if(  (userCard.CardNumber).Length != 16)
            {
                return BadRequest("Card Number Should be 16 Digits Long");
            }

            var createdCard = _cardService.AddCard(userCard);
            return CreatedAtAction(nameof(GetAllCards), new { userId = createdCard.UserId }, createdCard);
        }

        [HttpPut("update/{cardId}")]
        public IActionResult UpdateCard(int cardId, [FromBody] UserCard userCard) //cardId only provided in the URL
        { 
            if (userCard == null)
                return BadRequest("Invalid card data.");
            _cardService.UpdateCard(cardId, userCard);
            return Ok("Card updated successfully.");
        }

        [HttpPut("setDefault")]
        public IActionResult SetDefaultCard([FromBody] CardInfo cardInfo)
        {
            UserCard existingDefaultCard = _cardService.GetDefaultCard(cardInfo.UserId);
            if(existingDefaultCard.Id == cardInfo.CardId)
            {
                return Ok("The Card is already on Display");
            }
            _cardService.SetDefaultCard(cardInfo.UserId, cardInfo.CardId);
            return Ok("Card display preference updated successfully.");
        }
        [HttpGet("getDefault/{userId}")]
        public ActionResult<UserCard> getDefault(int userId)
        {
           UserCard card = _cardService.GetDefaultCard(userId);
            if(card == null)
            {
                return NotFound("No Display Card Found for this User");
            }
            return Ok(card);
        }
    }
}
