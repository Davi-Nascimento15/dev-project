using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Client.Commands.ProcessClient;
using Application.User.Commands.ProcessUser;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Persistence.BackgroundJobs
{
    public class CsvProcessingWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _period = TimeSpan.FromMinutes(30);

        public CsvProcessingWorker(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new PeriodicTimer(_period);

            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                    await mediator.Send(new ProcessUserCommandRequest(), stoppingToken);
                    await mediator.Send(new ProcessClientCommandRequest(), stoppingToken);
                }
            }
        }
    }
}