﻿using System;
using Autofac;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using Radio.Core;
using Radio.Infrastructure.Api.Extensions;

namespace Radio.Infrastructure.Api.Pipeline
{
    public static class Middlewares
    {
        public static IApplicationBuilder UseScopeMiddleware(this IApplicationBuilder app, IUnitOfWorkFactory<ILifetimeScope> unitOfWorkFactory)
        {
            app.Use(async (context, next) =>
            {
                // Don't create a unit of work for SignalR requests
                // The database connection would be held open for the entire time the user is connected, 
                // which would lead to SqlConnection pool exhaustion over time
                if (context.Request.Path.StartsWithSegments(Constants.SIGNALR_PATH))
                {
                    await next();
                    return;
                }

                using (var unitOfWork = unitOfWorkFactory.Begin())
                {
                    context.SetRequestUnitOfWork(unitOfWork);

                    await next();
                }
            });

            return app;
        }

        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (OperationCanceledException)
                {
                }
                catch (Exception ex)
                {
                    var logger = context.GetRequestUnitOfWork()?.Dependent?.Resolve<ILogger>();
                    logger?.LogCritical(ex, "Global Exception Handler caught an exception.");

                    throw;
                }
            });

            return app;
        }
    }
}
