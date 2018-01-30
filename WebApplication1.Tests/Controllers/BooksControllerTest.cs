using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebApplication1;
using WebApplication1.Controllers;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Results;
using Moq;
using PripremaTest1.Interfaces;
using PripremaTest1.Models;
using PripremaTest1.Controllers;
namespace WebApplication1.Tests.Controllers

{
    [TestClass]
    public class BooksControllerTest
    {
        [TestMethod]
        public void GetReturnsProductWithSameId()
        {
            // Arrange
            var mockRepository = new Mock<IBookRepo>();
            mockRepository.Setup(x => x.GetById(2)).Returns(new Book { Id = 2});

            var controller = new BooksController(mockRepository.Object);

            // Act
            IHttpActionResult actionResult = controller.Get(2);
            var contentResult = actionResult as OkNegotiatedContentResult<Book>;

            // Assert
            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content);
            Assert.AreEqual(2, contentResult.Content.Id);
        }

        [TestMethod]
        public void GetReturnsNotFound()
        {
            // Arrange
            var mockRepository = new Mock<IBookRepo>();
            var controller = new BooksController(mockRepository.Object);

            // Act
            IHttpActionResult actionResult = controller.Get(25);

            // Assert
            Assert.IsInstanceOfType(actionResult, typeof(NotFoundResult));
        }

        [TestMethod]
        public void EditReturnsOk()
        {
            // Arrange
            var mockRepository = new Mock<IBookRepo>();
            mockRepository.Setup(x => x.GetById(10)).Returns(new Book { Id = 10 });
            var controller = new BooksController(mockRepository.Object);
            
            // Act
            IHttpActionResult actionResult = controller.Get(10);
            var contentResult = actionResult as OkNegotiatedContentResult<Book>;
            IHttpActionResult actionResultEdit = controller.Put(10, contentResult.Content);
            // Assert
            Assert.IsInstanceOfType(actionResultEdit, typeof(OkResult));
        }

        [TestMethod]
        public void DeleteReturnsOk()
        {
            // Arrange
            var mockRepository = new Mock<IBookRepo>();
            mockRepository.Setup(x => x.GetById(10)).Returns(new Book { Id = 10 });
            var controller = new BooksController(mockRepository.Object);

            // Act
            IHttpActionResult actionResult = controller.Delete(16);

            // Assert
            Assert.IsInstanceOfType(actionResult, typeof(OkResult));
        }

        [TestMethod]
        public void PostMethodSetsLocationHeader()
        {
            // Arrange
            var mockRepository = new Mock<IBookRepo>();
            var controller = new BooksController(mockRepository.Object);

            // Act
            IHttpActionResult actionResult = controller.Post(new Book { Id = 18, Title = "Book 2" });
            var createdResult = actionResult as CreatedAtRouteNegotiatedContentResult<Book>;

            // Assert
            Assert.IsNotNull(createdResult);
            Assert.AreEqual("DefaultApi", createdResult.RouteName);
            Assert.AreEqual(18, createdResult.RouteValues["id"]);
        }
    }
}
